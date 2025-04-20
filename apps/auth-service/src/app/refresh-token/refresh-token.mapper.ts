import { Injectable } from '@nestjs/common';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class RefreshTokenMapper {
  toRefreshToken(user_id: string, jti: string, expiresAt: Date, device: string): RefreshToken {
    const refreshToken = new RefreshToken();
    refreshToken.user_id = user_id;
    refreshToken.jti = jti;
    refreshToken.device = device;
    refreshToken.expiresAt = expiresAt;
    return refreshToken;
  }
}
