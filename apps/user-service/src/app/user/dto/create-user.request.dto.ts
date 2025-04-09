import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUser {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  readonly firstname?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  readonly lastname?: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase().trim())
  readonly email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly avatarUrl?: string;
}
