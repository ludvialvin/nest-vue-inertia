import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import { json, urlencoded } from 'express';
import { join } from 'node:path';
import { Inertia } from '@inertify/core';
import { AppModule } from './app.module';
import { inertiaMiddleware } from './inertia.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  const config = app.get(ConfigService);

  Inertia.setConfig({
    view: 'index',
    version: config.get<string>('INERTIA_VERSION', '1'),
  });

  const isProd = process.env.NODE_ENV === 'production';
  const port = Number(config.get('PORT', '3000'));
  const appUrl = config.get<string>('APP_URL', 'http://localhost:3000');
  const frontendUrl = config.get<string>('FRONTEND_URL', '');

  app.enableShutdownHooks();
  app.set('trust proxy', parseTrustProxy(config.get('TRUST_PROXY', 'false')));

  app.use(compression());
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: {
        policy: isProd ? 'same-origin' : 'cross-origin',
      },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      strictTransportSecurity: isProd ? undefined : false,
      contentSecurityPolicy: {
        directives: buildCspDirectives({ isProd, frontendUrl }),
      },
    }),
  );
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  app.use(
    '/api',
    cors(
      buildCorsOptions(config.get<string>('CORS_ORIGINS', ''), [
        appUrl,
        frontendUrl,
      ]),
    ),
  );

  app.use(inertiaMiddleware);
  app.useStaticAssets(join(process.cwd(), 'public'), { index: false });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(port);
}

type CspDirectives = Record<string, Iterable<string>>;

function buildCspDirectives({
  isProd,
  frontendUrl,
}: {
  isProd: boolean;
  frontendUrl: string;
}): CspDirectives {
  const devSources = isProd
    ? []
    : frontendUrl
      ? [frontendUrl, frontendUrl.replace(/^http/, 'ws')]
      : [];

  return {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      ...(isProd
        ? []
        : [
            "'unsafe-inline'",
            "'unsafe-eval'",
            ...(frontendUrl ? [frontendUrl] : []),
          ]),
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      ...(isProd ? [] : frontendUrl ? [frontendUrl] : []),
    ],
    imgSrc: ["'self'", 'data:'],
    fontSrc: ["'self'", 'data:'],
    connectSrc: ["'self'", 'data:', ...devSources],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    ...(isProd ? { upgradeInsecureRequests: [] } : {}),
  };
}

function parseTrustProxy(
  value: string | undefined,
): boolean | number | string | string[] {
  if (!value) return false;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^\d+$/.test(value)) return Number(value);
  return value;
}

function buildCorsOptions(
  rawOrigins: string,
  extraOrigins: string[],
): CorsOptions {
  const origins = new Set([
    ...rawOrigins
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => /^https?:\/\//.test(origin)),
    ...extraOrigins.filter(Boolean),
  ]);

  return {
    origin: (origin, callback) => {
      if (!origin || origins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'X-Requested-With',
      'X-Inertia',
      'X-Inertia-Version',
      'X-Inertia-Location',
      'X-Inertia-Partial-Component',
      'X-Inertia-Partial-Data',
    ],
    exposedHeaders: [
      'X-Inertia',
      'X-Inertia-Version',
      'X-Inertia-Location',
      'X-Inertia-Partial-Component',
    ],
    maxAge: 86400,
  };
}

void bootstrap();
