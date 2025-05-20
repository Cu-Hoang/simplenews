import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

describe('CommentController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [CommentService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API from comment service"', () => {
      const commentController = app.get<CommentController>(CommentController);
      expect(commentController.healtCheck()).toEqual({ message: 'Hello API from comment service' });
    });
  });
});
