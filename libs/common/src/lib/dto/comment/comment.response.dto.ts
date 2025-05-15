export class CommentResponse {
  readonly id: string;

  readonly article_id: string;

  readonly user_id: string;

  readonly content: string;

  readonly is_edited: boolean;

  readonly status: string;
}
