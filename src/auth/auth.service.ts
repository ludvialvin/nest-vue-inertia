import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthUser, JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const count = await this.userRepo.count();
    if (count === 0) {
      const user = new User();
      user.name = this.config.get<string>(
        'DEFAULT_ADMIN_NAME',
        'Administrator',
      );
      user.email = this.config
        .get<string>('DEFAULT_ADMIN_EMAIL', 'admin@example.com')
        .toLowerCase();
      user.password = await this.hashPassword(
        this.config.get<string>('DEFAULT_ADMIN_PASSWORD', 'admin123'),
      );
      user.role = 'admin';
      await this.userRepo.save(user);
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    const user = await this.userRepo.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      return null;
    }
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return null;
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  signToken(user: AuthUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwt.sign(payload);
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    return this.jwt.verifyAsync<JwtPayload>(token);
  }

  async findUserById(id: number): Promise<AuthUser | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    return user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      : null;
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}
