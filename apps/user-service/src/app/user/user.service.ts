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
import { CreateUserRequest } from './dto/create-user.request.dto';
import { UserResponse } from './dto/user.response.dto';
import { UserMapper } from './user.mapper';
import * as bcrypt from 'bcrypt';
import { UpdateUserRequest } from './dto/update-user.request.dto';
import { UpdateUserEmailRequest } from './dto/update-user-email.request.dto';
import { UpdateUserPasswordRequest } from './dto/update-user-password.request.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    private readonly userMapper: UserMapper,
  ) {}

  async create(request: CreateUserRequest): Promise<ResonseEntity<UserResponse>> {
    try {
      const user = this.userMapper.toUser(request);
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(user.password, salt);
      user.password = hashPassword;
      return new ResonseEntity(
        201,
        'registered user successfully',
        this.userMapper.toUserResponse(await this.userRepository.save(user)),
      );
    } catch (error: any) {
      if (error.code == 23505) throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      throw new InternalServerErrorException('Something went wrong, Try again!');
    }
  }

  async update(id: string, request: UpdateUserRequest): Promise<ResonseEntity<UserResponse>> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      const updatedUser = Object.assign(user, request);
      return new ResonseEntity(
        200,
        'Updated user successfully',
        this.userMapper.toUserResponse(await this.userRepository.save(updatedUser)),
      );
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong, Try again!');
    }
  }

  async updateEmail(
    id: string,
    request: UpdateUserEmailRequest,
  ): Promise<ResonseEntity<UserResponse>> {
    try {
      const originalUser = await this.userRepository.findOneBy({ id });
      if (!originalUser) throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      const newUser = await this.userRepository.findOneBy({ email: request.email });
      if (newUser && newUser.id != id)
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      originalUser.email = request.email;
      return new ResonseEntity(
        200,
        'Updated user email successfully',
        this.userMapper.toUserResponse(await this.userRepository.save(originalUser)),
      );
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong, Try again!');
    }
  }

  async updatePassword(
    id: string,
    request: UpdateUserPasswordRequest,
  ): Promise<ResonseEntity<UserResponse>> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(request.password, salt);
      user.password = hashPassword;
      return new ResonseEntity(
        200,
        'Updated user password successfully',
        this.userMapper.toUserResponse(await this.userRepository.save(user)),
      );
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong, Try again!');
    }
  }

  async getAll(): Promise<ResonseEntity<UserResponse[]>> {
    try {
      return new ResonseEntity(
        200,
        'Got all users successfully',
        (await this.userRepository.find()).map((x) => this.userMapper.toUserResponse(x)),
      );
    } catch (error: any) {
      throw new InternalServerErrorException('Something went wrong, Try again!');
    }
  }

  async getById(id: string): Promise<ResonseEntity<UserResponse>> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) if (!user) throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      return new ResonseEntity(
        200,
        'Got user by id successfully',
        this.userMapper.toUserResponse(user),
      );
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong, Try again!');
    }
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
