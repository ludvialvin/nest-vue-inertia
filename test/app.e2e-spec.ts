import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { inertiaMiddleware } from '../src/inertia.middleware';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(inertiaMiddleware);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET) redirects to /auth/login when unauthenticated', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(302)
      .expect('Location', /\/auth\/login/);
  });

  it('/ (GET) returns 409 + X-Inertia-Location when unauthenticated & Inertia', async () => {
    await request(app.getHttpServer())
      .get('/')
      .set('X-Inertia', 'true')
      .expect(409)
      .expect('X-Inertia-Location', '/auth/login');
  });

  it('/auth/login (GET) redirects to the SSO /oauth/authorize endpoint', async () => {
    await request(app.getHttpServer())
      .get('/auth/login')
      .expect(302)
      .expect(
        'Location',
        /http:\/\/localhost:8000\/oauth\/authorize\?.*code_challenge=/,
      );
  });

  it('/auth/login (GET) sets PKCE state cookies', async () => {
    const res = await request(app.getHttpServer()).get('/auth/login');
    expect(res.headers['set-cookie']).toBeDefined();

    const setCookie = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie'].join('; ')
      : String(res.headers['set-cookie']);
    expect(setCookie).toMatch(/oauth_state=/);
    expect(setCookie).toMatch(/oauth_verifier=/);
  });

  it('/api/health (GET) is public', async () => {
    await request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        const body = res.body as { status: string };
        expect(body.status).toBe('ok');
      });
  });
});
