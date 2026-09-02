import { Controller, Get, Param, ParseIntPipe, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { DBSource } from 'src/database/datasource';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Controller()
export class AppController {
  @Get()
  dashboard(@Req() req: Request, @Res() res: Response) {
    return res.inertia.render('Dashboard', {
      title: 'Dashboard',
      user: req.user,
    });
  }

  @Get('users/:id')
  user(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
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
        user: req.user,
        notFound: true,
      });
    }

    return res.inertia.render('Users/Show', { user: req.user, profile: user });
  }

  @Get('not-found')
  notFoundPage(@Req() req: Request, @Res() res: Response) {
    return res.inertia.render('NotFound', { user: req.user });
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
