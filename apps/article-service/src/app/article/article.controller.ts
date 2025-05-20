import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleResponse, CreateArticleRequest, RpcRolesGuard } from '@simplenews/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller()
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

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

  @UseGuards(RpcRolesGuard)
  @SetMetadata('roles', ['author'])
  @MessagePattern({ cmd: 'update article' })
  async update(
    @Payload() data: { user: any; article_id: string; requestDto: CreateArticleRequest },
  ): Promise<ArticleResponse> {
    const {
      user: { id },
      article_id,
      requestDto,
    } = data;
    return await this.articleService.update(id, article_id, requestDto);
  }

  @MessagePattern({ cmd: 'get article by id' })
  async getById(@Payload() data: { id: string }): Promise<ArticleResponse> {
    const { id } = data;
    return await this.articleService.getById(id);
  }

  @Get()
  get() {
    return this.articleService.get();
  }

  @Get('/health')
  @HealthCheck()
  check() {
    return this.health.check([() => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com')]);
  }
}
