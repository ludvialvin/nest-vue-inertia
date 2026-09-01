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

  it('/ (GET) redirects to /login when unauthenticated', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(302)
      .expect('Location', /\/login/);
  });

  it('/ (GET) returns 409 + X-Inertia-Location when unauthenticated & Inertia', async () => {
    await request(app.getHttpServer())
      .get('/')
      .set('X-Inertia', 'true')
      .expect(409)
      .expect('X-Inertia-Location', '/login');
  });

  it('/login (GET) returns the full page shell', async () => {
    await request(app.getHttpServer())
      .get('/login')
      .expect(200)
      .expect('Content-Type', /html/)
      .then((res) => {
        expect(res.text).toContain('type="application/json" data-page="app"');
        expect(res.text).toContain('"component":"Login"');
      });
  });

  it('/login (GET) returns JSON for Inertia requests', async () => {
    await request(app.getHttpServer())
      .get('/login')
      .set('X-Inertia', 'true')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        const body = res.body as {
          version: string;
          component: string;
          props: { errors: Record<string, unknown> };
          url: string;
        };
        expect(typeof body.version).toBe('string');
        expect(body.component).toBe('Login');
        expect(body.props.errors).toEqual({});
        expect(body.url).toBe('/login');
      });
  });

  it('/login (POST) returns 422 with errors for empty credentials', async () => {
    await request(app.getHttpServer())
      .post('/login')
      .set('X-Inertia', 'true')
      .send({ email: '', password: '' })
      .expect(422)
      .then((res) => {
        const body = res.body as { props: { errors: Record<string, string> } };
        expect(body.props.errors.email).toBeDefined();
        expect(body.props.errors.email).toContain('wajib diisi');
      });
  });
});