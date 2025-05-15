import { Test } from '@nestjs/testing';
import { ArticleService } from './article.service';

describe('ArticleService', () => {
  let service: ArticleService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [ArticleService],
    }).compile();

    service = app.get<ArticleService>(ArticleService);
  });

  describe('healthCheck', () => {
    it('should return "Hello API from article service"', () => {
      expect(service.healthCheck()).toEqual({ message: 'Hello API article service' });
    });
  });
});
