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
} from '@simplenews/common';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly clientUserService: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly clientAuthService: ClientProxy,
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
      console.log(error);
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

  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const { email, password } = request;
      const pattern = { cmd: 'login' };
      const payload = { email, password };
      return await firstValueFrom(this.clientAuthService.send<LoginResponse>(pattern, payload));
    } catch (error: any) {
      console.log(error);
      throw new RpcException(error);
    }
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
