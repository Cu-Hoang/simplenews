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
} from '@simplenews/common';
import {
  Body,
  Controller,
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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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

  @Get()
  getData() {
    return this.appService.getData();
  }
}
