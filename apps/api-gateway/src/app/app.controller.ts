import {
  ResonseEntity,
  UserResponse,
  UpdateUserRequest,
  CreateUserRequest,
  UpdateUserEmailRequest,
  UpdateUserPasswordRequest,
} from '@simplenews/common';
import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

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

  @Get('/users')
  async getAll(): Promise<ResonseEntity<UserResponse[]>> {
    return await this.appService.getAllUsers();
  }

  @Get('/users/:id')
  async getById(@Param('id') id: string): Promise<ResonseEntity<UserResponse>> {
    return await this.appService.getUserById(id);
  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}
