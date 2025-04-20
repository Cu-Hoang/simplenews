import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class AllRpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest();

    const response = ctx.getResponse();

    const error = exception.getError();
    let status = 500;
    if (typeof error === 'object' && error !== null) {
      if ('statusCode' in error && typeof error.statusCode === 'number') status = error.statusCode;
      else if (error.status === 'error') status = 403;
    }
    const message =
      typeof error === 'object' && error.message ? error.message : 'Internal Server Error';
    console.log(error);
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
