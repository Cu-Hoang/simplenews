import { CommentResponse } from '@simplenews/common';
import { Comment } from './comment.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentMapper {
  toCommentResponse(comment: Comment): CommentResponse {
    return {
      id: comment.id,
      article_id: comment.article_id,
      user_id: comment.user_id,
      content: comment.content,
      is_edited: comment.is_edited,
      status: comment.status,
    };
  }
}
