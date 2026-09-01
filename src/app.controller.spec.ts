import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './web/app.controller';
import { AppService } from './web/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('dashboard', () => {
    it('should render the Dashboard page via Inertia', async () => {
      const render = jest.fn();
      const res = {
        inertia: { render },
      } as unknown as import('express').Response;

      const result = await appController.dashboard(res);

      expect(result).toBeUndefined();
      expect(render).toHaveBeenCalledWith('Dashboard', {
        title: 'Dashboard',
        user: { name: 'John Doe', email: 'john@example.com' },
      });
    });
  });
});
