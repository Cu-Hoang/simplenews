import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

describe('ArticleController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [ArticleService],
    }).compile();
  });

  describe('healthCheck', () => {
    it('should return "Hello API from article service"', () => {
      const articleController = app.get<ArticleController>(ArticleController);
      expect(articleController.healthCheck()).toEqual({
        message: 'Hello API from article service',
      });
    });
  });
});
