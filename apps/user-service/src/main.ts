// eslint-disable-next-line @nx/enforce-module-boundaries
import { HttpExceptionFilter } from '../../../libs/common/src/lib/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './app/user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
