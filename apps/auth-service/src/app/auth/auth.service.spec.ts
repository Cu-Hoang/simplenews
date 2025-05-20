import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = app.get<AuthService>(AuthService);
  });

  describe('get', () => {
    it('should return "Hello API from auth service"', () => {
      expect(service.get()).toEqual({ message: 'Hello API auth service' });
    });
  });
});
