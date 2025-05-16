/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from '@simplenews/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.MSA_HOST ?? '127.0.0.1',
      port: Number(process.env.MSA_PORT ?? 4002),
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  const globalPrefix = 'api';
  const apiVersion = process.env.API_VERSION ?? 'v1';
  app.setGlobalPrefix(globalPrefix + '/' + apiVersion);
  const httpPort = Number(process.env.HTTP_PORT ?? 3002);
  await app.startAllMicroservices();
  await app.listen(httpPort);
  Logger.log(
    `🚀 Application is running on: http://localhost:${httpPort}/${globalPrefix}/${apiVersion}/healthCheck`,
  );
}

bootstrap();
