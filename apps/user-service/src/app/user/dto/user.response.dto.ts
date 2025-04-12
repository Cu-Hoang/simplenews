export class UserResponse {
  readonly id: string;

  readonly firstname: string;

  readonly lastname: string;

  readonly email: string;

  readonly role: string;

  readonly freeArticlesRead: number;

  readonly lastReadReset: Date;

  readonly isPremium: boolean;

  readonly premiumExpiry: Date;

  readonly avatarUrl: string;
}
