import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { SsoUser } from './sso.service';
import type { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  generateLocalToken(user: SsoUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return this.jwt.sign(payload);
  }

  verifyLocalToken(token: string): JwtPayload {
    return this.jwt.verify(token);
  }
}
