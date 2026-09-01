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

  it('/ (GET) returns the full page shell', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .then((res) => {
        expect(res.text).toContain('type="application/json" data-page="app"');
        expect(res.text).toContain('"component":"Dashboard"');
      });
  });

  it('/ (GET) returns JSON for Inertia requests', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('X-Inertia', 'true')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        const body = res.body as {
          version: string;
          component: string;
          props: { title: string; user: { name: string; email: string } };
          url: string;
        };
        expect(typeof body.version).toBe('string');
        expect(body.component).toBe('Dashboard');
        expect(body.props).toEqual({
          title: 'Dashboard',
          user: { name: 'John Doe', email: 'john@example.com' },
        });
        expect(body.url).toBe('/');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
