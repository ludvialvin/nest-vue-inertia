import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Inertia } from '@inertify/core';
import type { Request, Response, NextFunction } from 'express';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: number;
      name: string;
      email: string;
      role: string;
    }
    interface Response {
      inertia: { render: InertiaRender };
    }
  }
}

type InertiaRender = (
  component: string,
  props?: Record<string, any>,
  options?: { return?: boolean; statusCode?: number },
) => Promise<void | string | null>;

const VIEW_NAME = 'index';

class InertiaExpress extends Inertia {
  private readonly view = VIEW_NAME;
  private readonly frontendUrl =
    process.env.FRONTEND_URL || 'http://localhost:5173';

  constructor(
    req: Request,
    private readonly res: Response,
  ) {
    super(req);
  }

  async render(
    component: string,
    props?: Record<string, any>,
    options?: { return?: boolean; statusCode?: number },
  ): Promise<void | string | null> {
    const { statusCode, headers, data, isInertia } = await this.getReponseData({
      component,
      props,
    });

    for (const [key, value] of Object.entries(headers)) {
      if (value !== undefined) {
        this.res.setHeader(key, value);
      }
    }
    this.res.status(options?.statusCode ?? statusCode);

    if (isInertia) {
      this.res.send(data);
      return;
    }

    const html = await this.renderView(data);
    this.res.send(html);
  }

  private async renderView(pageJson: string | null): Promise<string> {
    const page = pageJson ?? '{}';

    if (process.env.NODE_ENV === 'production') {
      try {
        const template = await readFile(
          join(process.cwd(), 'public', `${this.view}.html`),
          'utf-8',
        );
        return template.replace(
          /<script type="application\/json" data-page="app"><%= JSON\.stringify\(page\) %><\/script>/,
          `<script type="application/json" data-page="app">${page}</script>`,
        );
      } catch {
        // fall through to the inline dev shell below
      }
    }

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NestJS + Inertia</title>
    <script type="application/json" data-page="app">${page}</script>
    <script type="module" src="${this.frontendUrl}/@vite/client"></script>
    <script type="module" src="${this.frontendUrl}/src/main.ts"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`;
  }
}

export function inertiaMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.inertia = new InertiaExpress(req, res);
  next();
}
