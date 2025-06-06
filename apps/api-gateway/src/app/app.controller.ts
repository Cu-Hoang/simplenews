import {
  ResonseEntity,
  UserResponse,
  UpdateUserRequest,
  CreateUserRequest,
  UpdateUserEmailRequest,
  UpdateUserPasswordRequest,
  LoginRequest,
  CreateArticleRequest,
  ArticleResponse,
  UpdateArticleRequest,
  ParamId,
  CreateCommentRequest,
  CommentResponse,
  UpdateCommentRequest,
  ParamArticleId,
} from '@simplenews/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  Response,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { HttpRolesGuard } from './role.guard';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Post('/users/register')
  async createUser(@Body() request: CreateUserRequest): Promise<ResonseEntity<UserResponse>> {
    return await this.appService.createUser(request);
  }

  @Patch('/users/update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() request: UpdateUserRequest,
  ): Promise<ResonseEntity<UserResponse>> {
    return await this.appService.updateUser(id, request);
  }

  @Put('/users/update/email/:id')
  async updateEmail(
    @Param('id') id: string,
    @Body() request: UpdateUserEmailRequest,
  ): Promise<ResonseEntity<UserResponse>> {
    return await this.appService.updateUserEmail(id, request);
  }

  @Put('/users/update/password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() request: UpdateUserPasswordRequest,
  ): Promise<ResonseEntity<UserResponse>> {
    return await this.appService.updateUserPassword(id, request);
  }

  @SetMetadata('roles', ['admin'])
  @UseGuards(JwtAuthGuard, HttpRolesGuard)
  @Get('/users')
  async getAll(@Request() request: Request): Promise<ResonseEntity<UserResponse[]>> {
    return await this.appService.getAllUsers(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/profile')
  async getProfile(@Request() request: Request): Promise<any> {
    return request.user;
  }

  @SetMetadata('roles', ['admin'])
  @UseGuards(JwtAuthGuard, HttpRolesGuard)
  @Get('/users/:id')
  async getById(
    @Param('id') id: string,
    @Request() request: Request,
  ): Promise<ResonseEntity<UserResponse>> {
    return await this.appService.getUserById(request, id);
  }

  @Post('/auths/login')
  async login(
    @Body() request: LoginRequest,
    @Response({ passthrough: true }) response: Response,
  ): Promise<ResonseEntity<null>> {
    return await this.appService.login(request, response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/auths/logout')
  async logout(
    @Request() request: Request,
    @Response({ passthrough: true }) response: Response,
  ): Promise<ResonseEntity<null>> {
    return await this.appService.logout(request?.cookies?.refresh_token, response);
  }

  @Post('/auths/renew-access-token')
  async renewAccessToken(
    @Request() request: Request,
    @Response({ passthrough: true }) response: Response,
  ): Promise<ResonseEntity<null>> {
    return await this.appService.renewAccessToken(
      request?.cookies?.access_token,
      request?.cookies?.refresh_token,
      response,
    );
  }

  @SetMetadata('roles', ['author'])
  @UseGuards(JwtAuthGuard, HttpRolesGuard)
  @Post('/articles')
  async createArticle(
    @Request() request: Request,
    @Body() requestDto: CreateArticleRequest,
  ): Promise<ResonseEntity<ArticleResponse>> {
    return await this.appService.createArticle(request, requestDto);
  }

  @Get('/articles')
  async getAllArticles(): Promise<ResonseEntity<ArticleResponse[]>> {
    return await this.appService.getAllArticles();
  }

  @SetMetadata('roles', ['author'])
  @UseGuards(JwtAuthGuard, HttpRolesGuard)
  @Patch('/articles/:id')
  async updateArticle(
    @Request() request: Request,
    @Param() paramId: ParamId,
    @Body() requestDto: UpdateArticleRequest,
  ): Promise<ResonseEntity<ArticleResponse>> {
    const { id } = paramId;
    return await this.appService.updateArticle(request, id, requestDto);
  }

  @Get('/articles/:id')
  async getArticleById(@Param() paramId: ParamId): Promise<ResonseEntity<ArticleResponse>> {
    const { id } = paramId;
    return await this.appService.getArticleById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/comments/:article_id')
  async createComment(
    @Request() request: Request,
    @Param() paramArticleId: ParamArticleId,
    @Body() requestDto: CreateCommentRequest,
  ): Promise<ResonseEntity<CommentResponse>> {
    const { article_id } = paramArticleId;
    return await this.appService.createComment(request, article_id, requestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/comments/:id')
  async editComment(
    @Request() request: Request,
    @Param() paramId: ParamId,
    @Body() requestDto: UpdateCommentRequest,
  ): Promise<ResonseEntity<CommentResponse>> {
    const { id } = paramId;
    return await this.appService.editComment(id, request, requestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/comments/:id')
  async deleteComment(
    @Request() request: Request,
    @Param() paramId: ParamId,
  ): Promise<ResonseEntity<null>> {
    const { id } = paramId;
    return await this.appService.deleteComment(id, request);
  }

  @Get('/comments/:article_id')
  async getAllComments(
    @Param() paramArticleId: ParamArticleId,
  ): Promise<ResonseEntity<CommentResponse[]>> {
    const { article_id } = paramArticleId;
    return await this.appService.getAllComments(article_id);
  }

  @Get()
  get() {
    return this.appService.get();
  }

  @Get('/health')
  @HealthCheck()
  check() {
    return this.health.check([() => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com')]);
  }
}
