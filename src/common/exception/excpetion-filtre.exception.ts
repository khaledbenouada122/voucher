import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { throwError } from 'rxjs';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('exception', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Handle Validation Errors
    const validationErrors =
      exception instanceof BadRequestException && typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).message
        : null;
    if (host.getType() === 'rpc') {
      const ctx = host.switchToRpc();
      // Send the error response back to the client
      return throwError(() =>
        JSON.stringify({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: validationErrors || exception.message,
          cause: exception.cause || null,
        })
      );
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: validationErrors || exception.message,
        cause: exception.cause || null,
      });
    }
  }
}
