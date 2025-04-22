import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  CreateUserRequest,
  ResonseEntity,
  UpdateUserRequest,
  UpdateUserEmailRequest,
  UpdateUserPasswordRequest,
  UserResponse,
  LoginResponse,
  LoginRequest,
  CreateArticleRequest,
  ArticleResponse,
  UpdateArticleRequest,
} from '@simplenews/common';
import { firstValueFrom } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly clientUserService: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly clientAuthService: ClientProxy,
    @Inject('ARTICLE_SERVICE') private readonly clientArticleService: ClientProxy,
  ) {}

  async createUser(request: CreateUserRequest): Promise<ResonseEntity<UserResponse>> {
    try {
      const pattern = { cmd: 'register' };
      const payload = request;
      const response: UserResponse = await firstValueFrom(
        this.clientUserService.send<UserResponse>(pattern, payload),
      );
      return {
        statusCode: 201,
        message: 'registed a user successfully',
        data: response,
      };
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  async updateUser(id: string, request: UpdateUserRequest): Promise<ResonseEntity<UserResponse>> {
    try {
      const pattern = { cmd: 'update user' };
      const payload = {
        id,
        request,
      };
      const response: UserResponse = await firstValueFrom(
        this.clientUserService.send<UserResponse>(pattern, payload),
      );
      return {
        statusCode: 200,
        message: 'updated an user successfully',
        data: response,
      };
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  async updateUserEmail(
    id: string,
    request: UpdateUserEmailRequest,
  ): Promise<ResonseEntity<UserResponse>> {
    try {
      const pattern = { cmd: 'update user email' };
      const payload = {
        id,
        request,
      };
      const response: UserResponse = await firstValueFrom(
        this.clientUserService.send<UserResponse>(pattern, payload),
      );
      return {
        statusCode: 200,
        message: 'updated an user email successfully',
        data: response,
      };
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  async updateUserPassword(
    id: string,
    request: UpdateUserPasswordRequest,
  ): Promise<ResonseEntity<UserResponse>> {
    try {
      const pattern = { cmd: 'update user password' };
      const payload = {
        id,
        request,
      };
      const response: UserResponse = await firstValueFrom(
        this.clientUserService.send<UserResponse>(pattern, payload),
      );
      return {
        statusCode: 200,
        message: 'updated an user password successfully',
        data: response,
      };
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  async getAllUsers(request: Request): Promise<ResonseEntity<UserResponse[]>> {
    try {
      const pattern = { cmd: 'get all users' };
      const payload = { user: request.user };
      const response: UserResponse[] = await firstValueFrom(
        this.clientUserService.send<UserResponse[]>(pattern, payload),
      );
      return {
        statusCode: 200,
        message: 'got all users successfully',
        data: response,
      };
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  async getUserById(request: Request, id: string): Promise<ResonseEntity<UserResponse>> {
    try {
      const pattern = { cmd: 'get user by id' };
      const payload = {
        user: request.user,
        id,
      };
      const response: UserResponse = await firstValueFrom(
        this.clientUserService.send<UserResponse>(pattern, payload),
      );
      return {
        statusCode: 200,
        message: 'got users by id successfully',
        data: response,
      };
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  async login(request: LoginRequest, response): Promise<ResonseEntity<null>> {
    try {
      const { email, password } = request;
      const pattern = { cmd: 'login' };
      const payload = { email, password };
      const { accessToken, refreshToken } = await firstValueFrom(
        this.clientAuthService.send<LoginResponse>(pattern, payload),
      );
      response.cookie('access_token', accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
      });
      response.cookie('refresh_token', refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return {
        statusCode: 201,
        message: 'logged in successfully',
        data: null,
      };
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  async logout(refresh_token: string, response: Response): Promise<ResonseEntity<null>> {
    try {
      if (!refresh_token)
        throw new RpcException({ statusCode: 400, message: 'Refresh token does not exist' });
      const pattern = { cmd: 'logout' };
      const payload = { refresh_token };
      await firstValueFrom(this.clientAuthService.send<any>(pattern, payload));
      response.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      response.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      return {
        statusCode: 201,
        message: 'logged out successfully',
        data: null,
      };
    } catch (error: any) {
      console.log(error);
      if (error instanceof RpcException) throw error;
      else throw new RpcException(error);
    }
  }

  async renewAccessToken(
    access_token: string,
    refresh_token: string,
    response: Response,
  ): Promise<ResonseEntity<null>> {
    try {
      if (!access_token)
        throw new RpcException({ statusCode: 400, message: 'Access token does not exist' });
      if (!refresh_token)
        throw new RpcException({ statusCode: 400, message: 'Refresh token does not exist' });
      const pattern = { cmd: 'renew access token' };
      const payload = { access_token, refresh_token };
      const { accessToken, refreshToken } = await firstValueFrom(
        this.clientAuthService.send<any>(pattern, payload),
      );
      response.cookie('access_token', accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
      });
      response.cookie('refresh_token', refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return {
        statusCode: 201,
        message: 'renewed access token successfully',
        data: null,
      };
    } catch (error: any) {
      console.log(error);
      if (error instanceof RpcException) throw error;
      else throw new RpcException(error);
    }
  }

  async createArticle(
    request: Request,
    requestDto: CreateArticleRequest,
  ): Promise<ResonseEntity<ArticleResponse>> {
    try {
      const pattern = { cmd: 'create article' };
      const payload = {
        user: request?.user,
        requestDto,
      };
      const response = await firstValueFrom(
        this.clientArticleService.send<ArticleResponse>(pattern, payload),
      );
      return {
        statusCode: 201,
        message: 'created an article successfully',
        data: response,
      };
    } catch (error: any) {
      if (error instanceof RpcException) throw error;
      else throw new RpcException(error);
    }
  }

  async getAllArticles(): Promise<ResonseEntity<ArticleResponse[]>> {
    try {
      const pattern = { cmd: 'get all articles' };
      const payload = {};
      const response: ArticleResponse[] = await firstValueFrom(
        this.clientArticleService.send<ArticleResponse[]>(pattern, payload),
      );
      return {
        statusCode: 200,
        message: 'got all articles successfully',
        data: response,
      };
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  async updateArticle(
    request: Request,
    id: string,
    requestDto: UpdateArticleRequest,
  ): Promise<ResonseEntity<ArticleResponse>> {
    try {
      const pattern = { cmd: 'update article' };
      const payload = {
        user: request?.user,
        article_id: id,
        requestDto,
      };
      const response = await firstValueFrom(
        this.clientArticleService.send<ArticleResponse>(pattern, payload),
      );
      return {
        statusCode: 200,
        message: 'updated an article successfully',
        data: response,
      };
    } catch (error: any) {
      if (error instanceof RpcException) throw error;
      else throw new RpcException(error);
    }
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
