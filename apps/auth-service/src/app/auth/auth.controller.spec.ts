import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();
  });

  describe('get', () => {
    it('should return "Hello API from auth service"', () => {
      const authController = app.get<AuthController>(AuthController);
      expect(authController.get()).toEqual({ message: 'Hello API auth service' });
    });
  });
});
