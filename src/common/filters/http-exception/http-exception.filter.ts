import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import path from 'path';

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const responseBody =
      typeof exceptionResponse === 'string' ? undefined : exceptionResponse;
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : 'message' in exceptionResponse
          ? exceptionResponse.message
          : exception.message;
    const errors =
      responseBody && 'errors' in responseBody ? responseBody.errors : undefined;

    response.status(status).json({
      statusCode: status,
      success: false,
      message,
      ...(errors ? { errors } : {}),
      path: request.url,
    });
  }
}
