import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { userProvider } from './user.provider';
import { UserService } from './user.service';
import { UserMapper } from './user.mapper';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [UserController],
  providers: [UserService, ...userProvider, UserMapper],
  exports: [UserService],
})
export class UserModule {}
