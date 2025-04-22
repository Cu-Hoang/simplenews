export class ArticleResponse {
  readonly id: string;

  readonly title: string;

  readonly content: string;

  readonly status: string;

  readonly category: string;

  readonly author: string;

  readonly editor?: string;

  readonly is_premium: boolean;

  readonly view_count: number;
}
