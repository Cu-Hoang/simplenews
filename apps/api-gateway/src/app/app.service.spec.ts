import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('healthCheck', () => {
    it('should return "Hello API from api gateway"', () => {
      expect(service.healthCheck()).toEqual({ message: 'Hello API from api gateway' });
    });
  });
});
