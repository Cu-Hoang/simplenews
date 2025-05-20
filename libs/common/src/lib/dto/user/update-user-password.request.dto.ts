import { IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../decorator/match.decorator';

export class UpdateUserPasswordRequest {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  readonly password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Match('password')
  readonly passwordConfirm: string;
}
