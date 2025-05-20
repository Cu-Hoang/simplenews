import { Controller, Get } from '@nestjs/common';
import { CommentService } from './comment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentResponse, CreateCommentRequest, UpdateCommentRequest } from '@simplenews/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller()
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @MessagePattern({ cmd: 'create comment' })
  async create(
    @Payload() data: { article_id: string; user: any; requestDto: CreateCommentRequest },
  ): Promise<CommentResponse> {
    const {
      article_id,
      user: { id },
      requestDto,
    } = data;
    return await this.commentService.create(article_id, id, requestDto);
  }

  @MessagePattern({ cmd: 'edit comment' })
  async edit(
    @Payload() data: { comment_id: string; user: any; requestDto: UpdateCommentRequest },
  ): Promise<CommentResponse> {
    const {
      comment_id,
      user: { id },
      requestDto,
    } = data;
    return await this.commentService.edit(comment_id, id, requestDto);
  }

  @MessagePattern({ cmd: 'delete comment' })
  async delete(@Payload() data: { comment_id: string; user: any }): Promise<CommentResponse> {
    const {
      comment_id,
      user: { id },
    } = data;
    return await this.commentService.delete(comment_id, id);
  }

  @MessagePattern({ cmd: 'get all comments' })
  async getAll(@Payload() data: { article_id: string }): Promise<CommentResponse[]> {
    const { article_id } = data;
    return await this.commentService.getAll(article_id);
  }

  @Get()
  get() {
    return this.commentService.get();
  }

  @Get('/health')
  @HealthCheck()
  check() {
    return this.health.check([() => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com')]);
  }
}
