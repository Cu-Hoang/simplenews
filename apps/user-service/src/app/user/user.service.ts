import {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserEmailRequest,
  UpdateUserPasswordRequest,
} from '@simplenews/common';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserMapper } from './user.mapper';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    private readonly userMapper: UserMapper,
  ) {}

  async create(data: CreateUserRequest): Promise<UserResponse> {
    try {
      const user = this.userMapper.toUser(data);
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(user.password, salt);
      user.password = hashPassword;
      return this.userMapper.toUserResponse(await this.userRepository.save(user));
    } catch (error: any) {
      if (error.code == '23505')
        throw new RpcException({ statusCode: 400, message: 'Email already exists' });
    }
  }

  async update(id: string, request: UpdateUserRequest): Promise<UserResponse> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new RpcException({ statusCode: 400, message: 'User does not exists' });
    const updatedUser = Object.assign(user, request);
    return this.userMapper.toUserResponse(await this.userRepository.save(updatedUser));
  }

  async updateEmail(id: string, request: UpdateUserEmailRequest): Promise<UserResponse> {
    const originalUser = await this.userRepository.findOneBy({ id });
    if (!originalUser) throw new RpcException({ statusCode: 400, message: 'User does not exist' });
    const newUser = await this.userRepository.findOneBy({ email: request.email });
    if (newUser && newUser.id != id)
      throw new RpcException({ statusCode: 409, message: 'Email already exists' });
    originalUser.email = request.email;
    return this.userMapper.toUserResponse(await this.userRepository.save(originalUser));
  }

  async updatePassword(id: string, request: UpdateUserPasswordRequest): Promise<UserResponse> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new RpcException({ statusCode: 400, message: 'User does not exist' });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(request.password, salt);
    user.password = hashPassword;
    return this.userMapper.toUserResponse(await this.userRepository.save(user));
  }

  async getAll(): Promise<UserResponse[]> {
    const userList = await this.userRepository.find();
    return userList.map((x) => this.userMapper.toUserResponse(x));
  }

  async getById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new RpcException({ statusCode: 400, message: 'User does not exist' });
    return this.userMapper.toUserResponse(user);
  }

  async getByEmailForAuth(email: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new RpcException({ statusCode: 400, message: 'User does not exist' });
    return {
      id: user.id,
      password: user.password,
      roles: user.roles,
      premium: user.isPremium,
    };
  }

  async getByIdInternally(id: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new RpcException({ statusCode: 400, message: 'User does not exist' });
    return {
      id: user.id,
      roles: user.roles,
      premium: user.isPremium,
    };
  }

  get(): { message: string } {
    return { message: 'Hello API from user service' };
  }
}
