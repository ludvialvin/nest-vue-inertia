import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from './decorators/public.decorator';
import { SsoService } from './sso.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly sso: SsoService,
    private readonly auth: AuthService,
  ) {}

  @Public()
  @Get('login')
  login(@Res() res: Response) {
    const { url, state, verifier } = this.sso.buildAuthorizationUrl();
    const isProd = process.env.NODE_ENV === 'production';
    const opts = {
      httpOnly: true,
      sameSite: 'lax' as const,
      path: '/',
      secure: isProd,
    };

    res.cookie('oauth_state', state, { ...opts, maxAge: 120_000 });
    res.cookie('oauth_verifier', verifier, { ...opts, maxAge: 120_000 });
    res.redirect(url);
  }

  @Public()
  @Get('callback')
  async callback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const cookies = (req.cookies ?? {}) as Record<string, string>;
    const expectedState = cookies['oauth_state'];
    const verifier = cookies['oauth_verifier'];

    res.clearCookie('oauth_state', { path: '/' });
    res.clearCookie('oauth_verifier', { path: '/' });

    if (!code || !state || !verifier) {
      return res.redirect('/?error=missing_params');
    }
    if (!this.sso.verifyState(expectedState, state)) {
      return res.redirect('/?error=state_mismatch');
    }

    try {
      const tokenRes = await this.sso.exchangeCode(code, verifier);
      const ssoUser = await this.sso.fetchMe(tokenRes.access_token);
      const localToken = this.auth.generateLocalToken(ssoUser);

      const isProd = process.env.NODE_ENV === 'production';
      res.cookie(process.env.AUTH_COOKIE_NAME ?? 'token', localToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.redirect('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login gagal';
      const msg = encodeURIComponent(message);
      return res.redirect(`/?error=${msg}`);
    }
  }

  @Public()
  @Get('logout')
  logout(@Res() res: Response) {
    const cookieName = process.env.AUTH_COOKIE_NAME ?? 'token';
    res.clearCookie(cookieName, { path: '/' });
    res.redirect('/');
  }

  @Public()
  @Get('sso-logout')
  ssoLogout(@Res() res: Response) {
    const cookieName = process.env.AUTH_COOKIE_NAME ?? 'token';
    res.clearCookie(cookieName, { path: '/' });
    res.redirect(this.sso.logoutUrl);
  }

  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }
}
