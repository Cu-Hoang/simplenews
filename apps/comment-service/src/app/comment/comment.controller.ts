import { Controller, Get } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/healthCheck')
  healtCheck() {
    return this.commentService.healtCheck();
  }
}
