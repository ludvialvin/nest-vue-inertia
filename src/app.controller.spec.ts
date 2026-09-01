import { Test, TestingModule } from '@nestjs/testing';
import type { Request, Response } from 'express';
import { AppController } from './web/app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('dashboard', () => {
    it('should render the Dashboard page with the authenticated user', async () => {
      const render = jest.fn();
      const req = {
        user: { id: 1, name: 'Budi Santoso', email: 'budi@example.com', role: 'admin' },
      } as unknown as Request;
      const res = {
        inertia: { render },
      } as unknown as Response;

      const result = await appController.dashboard(req, res);

      expect(result).toBeUndefined();
      expect(render).toHaveBeenCalledWith('Dashboard', {
        title: 'Dashboard',
        user: { id: 1, name: 'Budi Santoso', email: 'budi@example.com', role: 'admin' },
      });
    });
  });
});