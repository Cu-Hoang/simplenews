import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentRequest {
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
