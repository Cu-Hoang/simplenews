import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Comment, CommentSchema } from './comment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentMapper } from './comment.mapper';
import { TerminusModule } from '@nestjs/terminus';
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
    ClientsModule.registerAsync([
      {
        name: 'ARTICLE_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('ARTICLE_SERVICE_HOST', '127.0.0.1'),
            port: configService.get<number>('ARTICLE_SERVICE_PORT', 4003),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    TerminusModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentMapper],
})
export class CommentModule {}
