import 'module-alias/register';
import { BadRequestException, Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AllRpcExceptionFilter } from './app/all-rpc-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => Object.values(error.constraints || {})).flat();

        return new BadRequestException({
          statusCode: 400,
          message: messages,
        });
      },
    }),
  );

  app.useGlobalFilters(new AllRpcExceptionFilter());
  const globalPrefix = 'api';
  const apiVersion = process.env.API_VERSION ?? 'v1';
  app.setGlobalPrefix(globalPrefix + '/' + apiVersion);
  const httpPort = Number(process.env.HTTP_PORT ?? 3000);
  app.use(cookieParser());
  await app.listen(httpPort);
  Logger.log(`🚀 App1 is running on: http://localhost:${httpPort}/${globalPrefix}/${apiVersion}`);
}

bootstrap();
