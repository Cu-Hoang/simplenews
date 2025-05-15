import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './app/user/user.module';
import { HttpExceptionFilter } from '@simplenews/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const tcpPort = Number(process.env.TCP_PORT ?? 4001);
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
  const httpPort = Number(process.env.HTTP_PORT ?? 3001);
  await app.startAllMicroservices();
  await app.listen(httpPort);
  Logger.log(
    `🚀 Application is running on: http://localhost:${httpPort}/${globalPrefix}/healthCheck`,
  );
}

bootstrap();
