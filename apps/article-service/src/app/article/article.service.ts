import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './article.schema';
import { Model } from 'mongoose';
import { ArticleResponse, CreateArticleRequest, UpdateArticleRequest } from '@simplenews/common';
import { ArticleMapper } from './article.mapper';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly model: Model<ArticleDocument>,
    private readonly articleMapper: ArticleMapper,
  ) {}

  async create(id: string, requestDto: CreateArticleRequest): Promise<ArticleResponse> {
    return this.articleMapper.toArticleResponse(
      await new this.model({
        author_id: id,
        published_at: Date.now(),
        ...requestDto,
      }).save(),
    );
  }

  async getAll(): Promise<ArticleResponse[]> {
    const articlesList = await this.model.find().exec();
    return articlesList.map((x) => this.articleMapper.toArticleResponse(x));
  }

  async update(
    id: string,
    article_id: string,
    requestDto: UpdateArticleRequest,
  ): Promise<ArticleResponse> {
    const article = await this.model.findOne({ _id: article_id, author_id: id });
    if (!article)
      throw new RpcException({ statusCode: 400, message: 'The article does not exist' });
    const updatedArticle = Object.assign(article, requestDto);
    return this.articleMapper.toArticleResponse(await new this.model(updatedArticle).save());
  }

  async getById(id: string): Promise<ArticleResponse> {
    const article = await this.model.findOne({ _id: id });
    if (!article)
      throw new RpcException({ statusCode: 400, message: 'The article does not exist' });
    return this.articleMapper.toArticleResponse(article);
  }

  get(): { message: string } {
    return { message: 'Hello API from article service' };
  }
}
