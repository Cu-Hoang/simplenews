import { Test } from '@nestjs/testing';
import { UserService } from './user.service';

describe('AppService', () => {
  let service: UserService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = app.get<UserService>(UserService);
  });

  describe('get', () => {
    it('should return "Hello API from user service"', () => {
      expect(service.get()).toEqual({ message: 'Hello API user service' });
    });
  });
});
