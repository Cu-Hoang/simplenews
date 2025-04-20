import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { LoginResponse } from '@simplenews/common';
import { RefreshToken } from '../refresh-token/refresh-token.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v7 as uuidv7 } from 'uuid';
import { RefreshTokenMapper } from '../refresh-token/refresh-token.mapper';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly clientUserService: ClientProxy,
    @Inject('REFRESHTOKEN_REPOSITORY')
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly refreshTokenMapper: RefreshTokenMapper,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const pattern = { cmd: 'get user by email' };
      const payload = {
        email,
        password,
      };
      const userResponse: any = await firstValueFrom(
        this.clientUserService.send<any>(pattern, payload),
      );
      const isMatch = await bcrypt.compare(password, userResponse.password);
      if (userResponse && isMatch) {
        const { password, ...result } = userResponse;
        return result;
      }
      return null;
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  async authenticate(access_token: string): Promise<any> {
    try {
      const user = this.jwtService.verify(access_token);
      return {
        id: user.sub,
        roles: user.roles,
        premium: user.premium,
      };
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.validateUser(email, password);
    if (!user) throw new RpcException({ statusCode: 401, message: 'Unauthorized' });
    const jti = uuidv7();
    /** Handle the limitation of devices that can be logged in simultaneously*/
    const savedRefreshToken = this.refreshTokenMapper.toRefreshToken(
      user.id,
      jti,
      Date.now() + this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION'),
      'device_id',
    );
    this.refreshTokenRepository.save(savedRefreshToken);
    const accessToken = await this.jwtService.sign(
      {
        sub: user.id,
        roles: user.roles,
        premium: user.premium,
      },
      {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION'),
      },
    );
    const refreshToken = await this.jwtService.sign(
      {
        jti,
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION'),
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
