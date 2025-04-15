import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class AllRpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const error = exception.getError();

    const status = typeof error === 'object' && error['statusCode'] ? error['statusCode'] : 500;

    const message =
      typeof error === 'object' && error['message'] ? error['message'] : 'Internal Server Error';

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
