import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comment.schema';
import { Model } from 'mongoose';
import { CommentMapper } from './comment.mapper';
import {
  ArticleResponse,
  CommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@simplenews/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly model: Model<CommentDocument>,
    @Inject('ARTICLE_SERVICE') private readonly clientArticleService: ClientProxy,
    private readonly commentMapper: CommentMapper,
    private readonly httpService: HttpService,
  ) {}

  async classifyComment(content: string): Promise<any> {
    try {
      const url = 'http://localhost:8000/predict';
      const { data } = await firstValueFrom(
        this.httpService.post(url, { text: content }).pipe(timeout(15000)),
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async create(
    article_id: string,
    user_id: string,
    requestDto: CreateCommentRequest,
  ): Promise<CommentResponse> {
    try {
      const data = await this.classifyComment(requestDto.content);
      const pattern = { cmd: 'get article by id' };
      const payload = { id: article_id };
      const response: ArticleResponse = await firstValueFrom(
        this.clientArticleService.send<ArticleResponse>(pattern, payload),
      );
      if (data && response) {
        const { predicted_class } = data;
        const status = predicted_class == 0 ? 'visible' : 'flagged';
        return this.commentMapper.toCommentResponse(
          await new this.model({
            article_id,
            user_id,
            status,
            ...requestDto,
          }).save(),
        );
      }
    } catch (error: any) {
      if (error instanceof RpcException) throw error;
      else throw new RpcException(error);
    }
  }

  async edit(
    id: string,
    user_id: string,
    requestDto: UpdateCommentRequest,
  ): Promise<CommentResponse> {
    const comment = await this.model.findOne({ _id: id, user_id, deleted_at: null });
    if (!comment)
      throw new RpcException({ statusCode: 400, message: 'The comment does not exist' });
    const data = await this.classifyComment(requestDto.content);
    if (data) {
      const { predicted_class } = data;
      const status = predicted_class == 0 ? 'visible' : 'flagged';
      const updatedComment = Object.assign(comment, { status, is_edited: true, ...requestDto });
      return this.commentMapper.toCommentResponse(await new this.model(updatedComment).save());
    }
  }

  async delete(id: string, user_id: string): Promise<CommentResponse> {
    const comment = await this.model.findOne({ _id: id, user_id, deleted_at: null });
    if (!comment)
      throw new RpcException({ statusCode: 400, message: 'The comment does not exist' });
    const updatedComment = Object.assign(comment, { deleted_at: Date.now() });
    return this.commentMapper.toCommentResponse(await new this.model(updatedComment).save());
  }

  async getAll(article_id: string): Promise<CommentResponse[]> {
    const commentList = await this.model.find({ article_id, status: 'visible', deleted_at: null });
    return commentList.map((x) => this.commentMapper.toCommentResponse(x));
  }

  healtCheck(): { message: string } {
    return { message: 'Hello API from comment service' };
  }
}
