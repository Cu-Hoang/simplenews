import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserRequest {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  readonly firstname?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  readonly lastname?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly avatarUrl?: string;
}
