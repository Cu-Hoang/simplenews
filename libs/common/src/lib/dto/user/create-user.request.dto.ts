import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../decorator/match.decorator';

export class CreateUserRequest {
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
  @MaxLength(20)
  readonly password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Match('password')
  readonly passwordConfirm: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  readonly avatarUrl?: string;
}
