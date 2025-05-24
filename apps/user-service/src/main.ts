import 'module-alias/register';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './app/user/user.module';
import { HttpExceptionFilter } from '@simplenews/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.MSA_HOST ?? '127.0.0.1',
      port: Number(process.env.MSA_PORT ?? 4001),
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  const globalPrefix = 'api';
  const apiVersion = process.env.API_VERSION ?? 'v1';
  app.setGlobalPrefix(globalPrefix + '/' + apiVersion);
  const httpPort = Number(process.env.HTTP_PORT ?? 3001);
  await app.startAllMicroservices();
  await app.listen(httpPort);
  Logger.log(`🚀 App is running on: http://localhost:${httpPort}/${globalPrefix}/${apiVersion}`);
}

bootstrap();
