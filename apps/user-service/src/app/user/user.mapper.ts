import { Injectable } from '@nestjs/common';
import { CreateUserRequest, UserResponse } from '@simplenews/common';
import { User } from './user.entity';

@Injectable()
export class UserMapper {
  toUser(request: CreateUserRequest): User {
    const user = new User();
    user.firstname = request.firstname ?? '';
    user.lastname = request.lastname ?? '';
    user.email = request.email;
    user.password = request.password;
    user.avatarUrl = request.avatarUrl ?? '';
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
