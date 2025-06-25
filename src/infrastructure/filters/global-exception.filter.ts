import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<Response>();
      const req = ctx.getRequest<Request>();

      Logger.error(`💥 Global Error: ${exception.message}`, exception.stack);

      const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      const response = exception instanceof HttpException ? exception.getResponse() : {};

      const message = typeof response === 'string' ? response : response['message'] || exception.message || 'Internal server error';

      res.status(status).json({
        status: 'error',
        statusCode: status,
        message,
        ...(typeof response === 'object' ? response : {}),
      });
    } catch (error) {}
  }
}
