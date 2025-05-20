import { Test } from '@nestjs/testing';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [CommentService],
    }).compile();

    service = app.get<CommentService>(CommentService);
  });

  describe('get', () => {
    it('should return "Hello API from comment service"', () => {
      expect(service.get()).toEqual({ message: 'Hello API from comment service' });
    });
  });
});
