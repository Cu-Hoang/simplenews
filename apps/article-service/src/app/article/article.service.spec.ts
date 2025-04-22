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

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
