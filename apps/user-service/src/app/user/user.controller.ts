// eslint-disable-next-line @nx/enforce-module-boundaries
import { ResonseEntity } from '../../../../../libs/common/src/lib/response-entity.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser } from './dto/create-user.request.dto';
import { UserResponse } from './dto/user.response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(@Body() createUser: CreateUser): Promise<ResonseEntity<UserResponse>> {
    return await this.userService.create(createUser);
  }

  @Get()
  getData() {
    return this.userService.getData();
  }
}
