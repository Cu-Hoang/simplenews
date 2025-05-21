import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './article.schema';
import { ArticleMapper } from './article.mapper';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

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
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    TerminusModule,
    HttpModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleMapper],
})
export class ArticleModule {}
