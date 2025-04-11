// eslint-disable-next-line @nx/enforce-module-boundaries
import { ResonseEntity } from '../../../../../libs/common/src/lib/response-entity.dto';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create-user.request.dto';
import { UserResponse } from './dto/user.response.dto';
import { UpdateUserRequest } from './dto/update-user.request.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(@Body() request: CreateUserRequest): Promise<ResonseEntity<UserResponse>> {
    return await this.userService.create(request);
  }

  @Patch('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateUserRequest,
  ): Promise<ResonseEntity<UserResponse>> {
    return await this.userService.update(id, request);
  }

  @Get()
  getData() {
    return this.userService.getData();
  }
}
