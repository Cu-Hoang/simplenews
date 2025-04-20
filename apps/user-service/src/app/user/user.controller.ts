import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserEmailRequest,
  UpdateUserPasswordRequest,
  RpcRolesGuard,
  RpcPremiumGuard,
} from '@simplenews/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'register' })
  async create(@Payload() data: CreateUserRequest): Promise<UserResponse> {
    return await this.userService.create(data);
  }

  @MessagePattern({ cmd: 'update user' })
  async update(@Payload() data: { id: string; request: UpdateUserRequest }): Promise<UserResponse> {
    const { id, request } = data;
    return await this.userService.update(id, request);
  }

  @MessagePattern({ cmd: 'update user email' })
  async updateEmail(
    @Payload() data: { id: string; request: UpdateUserEmailRequest },
  ): Promise<UserResponse> {
    const { id, request } = data;
    return await this.userService.updateEmail(id, request);
  }

  @MessagePattern({ cmd: 'update user password' })
  async updatePassword(
    @Payload() data: { id: string; request: UpdateUserPasswordRequest },
  ): Promise<UserResponse> {
    const { id, request } = data;
    return await this.userService.updatePassword(id, request);
  }

  @UseGuards(RpcRolesGuard)
  @SetMetadata('roles', ['admin'])
  @MessagePattern({ cmd: 'get all users' })
  async getAll(): Promise<UserResponse[]> {
    return await this.userService.getAll();
  }

  @UseGuards(RpcRolesGuard)
  @SetMetadata('roles', ['admin'])
  @MessagePattern({ cmd: 'get user by id' })
  async getById(@Payload() data: { id: string }): Promise<UserResponse> {
    const { id } = data;
    return await this.userService.getById(id);
  }

  @MessagePattern({ cmd: 'get user by email' })
  async getByEmailForAuth(@Payload() data: { email: string }): Promise<any> {
    const { email } = data;
    return await this.userService.getByEmailForAuth(email);
  }

  @Get()
  getData() {
    return this.userService.getData();
  }
}
