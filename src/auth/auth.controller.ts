import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import type { LoginDto } from './dto/login.dto';
import type { AuthUser } from './jwt.strategy';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Get('login')
  async loginPage(@Req() req: Request, @Res() res: Response) {
    const user = await this.userFromRequest(req);
    if (user) {
      return res.inertia.render('Dashboard', { title: 'Dashboard', user });
    }
    return res.inertia.render('Login', { errors: {} });
  }

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const email = (body.email ?? '').trim().toLowerCase();
    const password = body.password ?? '';

    if (!email || !password) {
      return res.inertia.render(
        'Login',
        { errors: { email: 'Email dan password wajib diisi' } },
        { statusCode: 422 },
      );
    }

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return res.inertia.render(
        'Login',
        { errors: { email: 'Email atau password salah' } },
        { statusCode: 422 },
      );
    }

    this.setAuthCookie(res, user);
    return res.inertia.render('Dashboard', { title: 'Dashboard', user });
  }

  @Public()
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie(this.config.get<string>('AUTH_COOKIE_NAME', 'token'), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    return res.inertia.render('Login', { errors: {} });
  }

  private cookieName(): string {
    return this.config.get<string>('AUTH_COOKIE_NAME', 'token');
  }

  private async userFromRequest(req: Request): Promise<AuthUser | null> {
    const token = this.tokenFromRequest(req);
    if (!token) {
      return null;
    }
    try {
      const payload = await this.authService.verifyToken(token);
      return this.authService.findUserById(payload.sub);
    } catch {
      return null;
    }
  }

  private tokenFromRequest(req: Request): string | null {
    const bearer = req.headers.authorization;
    if (bearer?.startsWith('Bearer ')) {
      return bearer.slice(7);
    }
    const cookies = req.cookies as Record<string, string> | undefined;
    return cookies?.[this.cookieName()] ?? null;
  }

  private setAuthCookie(res: Response, user: AuthUser) {
    const token = this.authService.signToken(user);
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(this.cookieName(), token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: this.config.get<number>(
        'JWT_EXPIRES_IN_MS',
        7 * 24 * 3600 * 1000,
      ),
    });
  }
}
