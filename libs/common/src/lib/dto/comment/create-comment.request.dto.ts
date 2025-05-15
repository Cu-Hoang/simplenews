import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentRequest {
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
