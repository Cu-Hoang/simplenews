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
  const tcpPort = Number(process.env.TCP_PORT ?? 4003);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: tcpPort,
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const httpPort = Number(process.env.HTTP_PORT ?? 3003);
  await app.startAllMicroservices();
  await app.listen(httpPort);
  Logger.log(`🚀 Application is running on: http://localhost:${httpPort}/${globalPrefix}`);
}

bootstrap();
