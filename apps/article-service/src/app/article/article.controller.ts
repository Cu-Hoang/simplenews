import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleResponse, CreateArticleRequest, RpcRolesGuard } from '@simplenews/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(RpcRolesGuard)
  @SetMetadata('roles', ['author'])
  @MessagePattern({ cmd: 'create article' })
  async create(
    @Payload() data: { user: any; requestDto: CreateArticleRequest },
  ): Promise<ArticleResponse> {
    const {
      user: { id },
      requestDto,
    } = data;
    return await this.articleService.create(id, requestDto);
  }

  @MessagePattern({ cmd: 'get all articles' })
  async getAll(): Promise<ArticleResponse[]> {
    return await this.articleService.getAll();
  }

  @Get()
  getData() {
    return this.articleService.getData();
  }
}
