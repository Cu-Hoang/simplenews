import { Injectable } from '@nestjs/common';
import { Article } from './article.schema';
import { ArticleResponse } from '@simplenews/common';

@Injectable()
export class ArticleMapper {
  toArticleResponse(article: Article): ArticleResponse {
    return {
      id: article.id,
      title: article.title,
      content: article.content,
      status: article.status,
      category: article.category,
      author_id: article.author_id,
      editor: article.editor ?? '',
      is_premium: article.is_premium,
      view_count: article.view_count,
      published_at: article.published_at ?? new Date('1900-01-01'),
    };
  }
}
