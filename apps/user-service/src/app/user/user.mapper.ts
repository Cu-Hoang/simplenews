import { Injectable } from '@nestjs/common';
import { CreateUser } from './dto/create-user.request.dto';
import { UserResponse } from './dto/user.response.dto';
import { User } from './user.entity';

@Injectable()
export class UserMapper {
  toUser(createUser: CreateUser): User {
    const user = new User();
    user.firstname = createUser.firstname ?? '';
    user.lastname = createUser.lastname ?? '';
    user.email = createUser.email;
    user.password = createUser.password;
    user.avatarUrl = createUser.avatarUrl ?? '';
    return user;
  }

  toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      firstname: user.firstname ?? '',
      lastname: user.lastname ?? '',
      email: user.email,
      role: user.role,
      freeArticlesRead: user.freeArticlesRead,
      lastReadReset: user.lastReadReset,
      isPremium: user.isPremium,
      premiumExpiry: user.premiumExpiry ?? new Date('2000-01-01'),
      avatarUrl: user.avatarUrl ?? '',
    };
  }
}
