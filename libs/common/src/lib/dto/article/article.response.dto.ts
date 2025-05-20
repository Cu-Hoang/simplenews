export class ArticleResponse {
  readonly id: string;

  readonly title: string;

  readonly content: string;

  readonly status: string;

  readonly category: string;

  readonly author_id: string;

  readonly editor?: string;

  readonly is_premium: boolean;

  readonly view_count: number;

  readonly published_at: Date;
}
