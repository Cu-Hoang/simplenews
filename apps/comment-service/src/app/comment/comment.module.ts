import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Comment, CommentSchema } from './comment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentMapper } from './comment.mapper';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 3,
    }),
    ClientsModule.register([
      {
        name: 'ARTICLE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4003,
        },
      },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentMapper],
})
export class CommentModule {}
