import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './article.schema';
import { Model } from 'mongoose';
import { ArticleResponse, CreateArticleRequest } from '@simplenews/common';
import { ArticleMapper } from './article.mapper';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly model: Model<ArticleDocument>,
    private readonly articleMapper: ArticleMapper,
  ) {}

  async create(id: string, requestDto: CreateArticleRequest): Promise<ArticleResponse> {
    return this.articleMapper.toUserResponse(
      await new this.model({ author: id, ...requestDto }).save(),
    );
  }

  async getAll(): Promise<ArticleResponse[]> {
    const articlesList = await this.model.find().exec();
    return articlesList.map((x) => this.articleMapper.toUserResponse(x));
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
