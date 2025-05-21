import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { refreshTokenProvider } from '../refresh-token/refresh-token.provider';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenMapper } from '../refresh-token/refresh-token.mapper';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('USER_SERVICE_HOST', '127.0.0.1'),
            port: configService.get<number>('USER_SERVICE_PORT', 4001),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
      }),
    }),
    TerminusModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ...refreshTokenProvider, RefreshTokenMapper],
  exports: [AuthService],
})
export class AuthModule {}
