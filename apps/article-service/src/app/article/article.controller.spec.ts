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

  describe('get', () => {
    it('should return "Hello API from article service"', () => {
      const articleController = app.get<ArticleController>(ArticleController);
      expect(articleController.get()).toEqual({
        message: 'Hello API from article service',
      });
    });
  });
});
