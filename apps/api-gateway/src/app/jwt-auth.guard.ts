import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private readonly clientAuthService: ClientProxy) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const accessToken = context.switchToHttp().getRequest().cookies?.access_token;
    if (!accessToken) {
      return false;
    }
    const pattern = { cmd: 'authenticate' };
    const payload = {
      access_token: accessToken,
    };
    return this.clientAuthService.send(pattern, payload).pipe(
      tap((request) => {
        context.switchToHttp().getRequest<Request>().user = request;
      }),
      map(() => true),
      catchError(() => {
        throw new UnauthorizedException('Invalid token');
      }),
    );
  }
}
