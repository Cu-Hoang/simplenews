// eslint-disable-next-line @nx/enforce-module-boundaries
import { ResonseEntity } from '../../../../../libs/common/src/lib/response-entity.dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUser } from './dto/create-user.request.dto';
import { UserResponse } from './dto/user.response.dto';
import { UserMapper } from './user.mapper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    private readonly userMapper: UserMapper,
  ) {}

  async create(createUser: CreateUser): Promise<ResonseEntity<UserResponse>> {
    try {
      const user = this.userMapper.toUser(createUser);
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(user.password, salt);
      user.password = hashPassword;
      return new ResonseEntity(
        201,
        'registered user successfully',
        this.userMapper.toUserResponse(await this.userRepository.save(user)),
      );
    } catch (error: any) {
      if (error.code == 23505) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw new InternalServerErrorException('Something went wrong, Try again!');
    }
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
