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

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const articleController = app.get<ArticleController>(ArticleController);
      expect(articleController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
