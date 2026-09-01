import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  randomBytes,
  createHash,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto';

export interface SsoUser {
  id: number;
  nik?: string;
  username?: string;
  name: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  picture?: string;
  department?: string;
  manager?: string;
  email?: string;
  role?: string;
  users_group_id?: number;
  appEnabled?: boolean;
  appId?: string;
  appName?: string;
  clientApps: unknown[];
  [key: string]: unknown;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

function toB64u(input: Uint8Array): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

@Injectable()
export class SsoService {
  private readonly logger = new Logger(SsoService.name);
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly authUrl: string;
  private readonly tokenUrl: string;
  private readonly meUrl: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>(
      'SSO_BASE_URL',
      'http://localhost:8000',
    );
    this.clientId = this.config.get<string>('SSO_CLIENT_ID', '');
    this.clientSecret = this.config.get<string>('SSO_CLIENT_SECRET', '');
    this.redirectUri = this.config.get<string>(
      'SSO_REDIRECT_URI',
      'http://localhost:3000/auth/callback',
    );
    this.authUrl = `${this.baseUrl}/oauth/authorize`;
    this.tokenUrl = `${this.baseUrl}/oauth/token`;
    this.meUrl = `${this.baseUrl}/api/me`;
  }

  /**
   * Builds the authorization URL for the OAuth2 Authorization Code + PKCE flow.
   * The PKCE verifier + challenge, plus an anti-CSRF state, are returned so the
   * controller can persist them in a cookie/session before redirecting.
   */
  buildAuthorizationUrl(): { url: string; state: string; verifier: string } {
    const verifier = toB64u(randomBytes(48));
    const challenge = toB64u(createHash('sha256').update(verifier).digest());
    const state = randomUUID();

    const query = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: '',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });

    return { url: `${this.authUrl}?${query.toString()}`, state, verifier };
  }

  verifyState(expected: string, received: string | undefined): boolean {
    if (!expected || !received) return false;
    const a = Buffer.from(expected);
    const b = Buffer.from(received);
    return a.length === b.length && timingSafeEqual(a, b);
  }

  /**
   * Exchanges the authorization code (+ PKCE verifier) for tokens using the
   * OAuth2 token endpoint.
   */
  async exchangeCode(code: string, verifier: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code,
      code_verifier: verifier,
    });

    const res = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`SSO token exchange failed (${res.status}): ${text}`);
      throw new UnauthorizedException('Gagal menukar kode otorisasi');
    }

    return (await res.json()) as TokenResponse;
  }

  /**
   * Fetches the current user profile from the SSO /api/me endpoint.
   */
  async fetchMe(accessToken: string): Promise<SsoUser> {
    const res = await fetch(this.meUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`SSO /api/me failed (${res.status}): ${text}`);
      throw new UnauthorizedException('Gagal mengambil profil pengguna');
    }

    return (await res.json()) as SsoUser;
  }
}
