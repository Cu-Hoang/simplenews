import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { UserMapper } from './user.mapper';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
  ],
  controllers: [UserController],
  providers: [UserService, ...userProviders, UserMapper],
  exports: [UserService],
})
export class UserModule {}
