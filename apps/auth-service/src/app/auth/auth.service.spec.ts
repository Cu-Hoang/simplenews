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

  describe('healthCheck', () => {
    it('should return "Hello API from auth service"', () => {
      expect(service.healthCheck()).toEqual({ message: 'Hello API auth service' });
    });
  });
});
