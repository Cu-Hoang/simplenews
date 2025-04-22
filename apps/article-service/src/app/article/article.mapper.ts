import { Injectable } from '@nestjs/common';
import { Article } from './article.schema';
import { ArticleResponse } from '@simplenews/common';

@Injectable()
export class ArticleMapper {
  toUserResponse(article: Article): ArticleResponse {
    return {
      id: article.id,
      title: article.title,
      content: article.content,
      status: article.status,
      category: article.category,
      author: article.author,
      editor: article.editor ?? '',
      is_premium: article.is_premium,
      view_count: article.view_count,
    };
  }
}
