import { Controller, Get, Param, ParseIntPipe, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request, Response } from 'express';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  dashboard(@Res() res: Response) {
    return res.inertia.render('Dashboard', {
      title: 'Dashboard',
      user: { name: 'John Doe', email: 'john@example.com' },
    });
  }

  @Get('users/:id')
  async user(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const users: User[] = [
      {
        id: '1',
        name: 'Budi Santoso',
        email: 'budi@example.com',
        role: 'Admin',
      },
      {
        id: '2',
        name: 'Siti Aminah',
        email: 'siti@example.com',
        role: 'Editor',
      },
      {
        id: '3',
        name: 'Rina Marlina',
        email: 'rina@example.com',
        role: 'Viewer',
      },
    ];

    const user = users.find((u) => u.id === String(id));

    if (!user) {
      return res.inertia.render('Users/Show', {
        notFound: true,
      });
    }

    return res.inertia.render('Users/Show', { user });
  }

  @Get('not-found')
  notFoundPage(@Res() res: Response) {
    return res.inertia.render('NotFound', {});
  }

  @Get('{*splat}')
  handleUnknown(@Req() req: Request, @Res() res: Response) {
    if (req.headers['x-inertia'] === 'true') {
      res.setHeader('X-Inertia-Location', '/not-found');
      res.status(409).json({ message: 'Not Found' });
      return;
    }

    res.redirect('/not-found');
  }
}
