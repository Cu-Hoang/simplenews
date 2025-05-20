import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginResponse } from '@simplenews/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @MessagePattern({ cmd: 'authenticate' })
  async authenticate(@Payload() data: { access_token: string }): Promise<any> {
    const { access_token } = data;
    return await this.authService.authenticate(access_token);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: { email: string; password: string }): Promise<LoginResponse> {
    const { email, password } = data;
    return await this.authService.login(email, password);
  }

  @MessagePattern({ cmd: 'logout' })
  async logout(@Payload() data: { refresh_token: string }): Promise<boolean> {
    const { refresh_token } = data;
    return await this.authService.logout(refresh_token);
  }

  @MessagePattern({ cmd: 'renew access token' })
  async renewAccessToken(
    @Payload() data: { access_token: string; refresh_token: string },
  ): Promise<LoginResponse> {
    const { access_token, refresh_token } = data;
    return await this.authService.renewAccessToken(access_token, refresh_token);
  }

  @Get()
  get() {
    return this.authService.get();
  }

  @Get('/health')
  @HealthCheck()
  check() {
    return this.health.check([() => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com')]);
  }
}
