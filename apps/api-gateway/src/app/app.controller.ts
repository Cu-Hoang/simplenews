import {
  ResonseEntity,
  UserResponse,
  UpdateUserRequest,
  CreateUserRequest,
  UpdateUserEmailRequest,
  UpdateUserPasswordRequest,
  LoginRequest,
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
    const { accessToken, refreshToken } = await this.appService.login(request);
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
  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}
