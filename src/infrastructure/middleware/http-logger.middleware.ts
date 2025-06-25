import { Injectable, NestMiddleware, Logger, Inject } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { first, trim } from 'lodash';
import { ServerConfigurationService } from 'src/modules/server-configuration/server-configuration.service';

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
  private logger = new Logger(HTTPLoggerMiddleware.name);

  @Inject() private readonly ServerConfigurationService: ServerConfigurationService;

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, body, headers } = request;
    const startTimeMilliseconds = Date.now().valueOf();

    const IP = trim(first(((headers['x-forwarded-for'] as string) || request.connection?.remoteAddress || '').split(',')));
    const userAgent = request.get('user-agent') || '';

    const shouldLogRequestBody = this.ServerConfigurationService.getConfig('http.logger.log.request.body') === '1';
    if (shouldLogRequestBody) {
      this.logger.log('Request Headers:');
      this.logger.log(headers);
      this.logger.log('Request Method:');
      this.logger.log(method);
      this.logger.log('Request Body:');
      this.logger.log(body);
      this.logger.log('Request URL:');
      this.logger.log(originalUrl);
      this.logger.log('Request IP:');
      this.logger.log(IP);
      this.logger.log('--------------------------------');
    }

    response.on('close', () => {
      const endTimeMilliseconds = Date.now().valueOf();
      const responseTimeMilliseconds = endTimeMilliseconds - startTimeMilliseconds;

      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${responseTimeMilliseconds > 1000 ? '🔴' : ''}${responseTimeMilliseconds}ms - ${userAgent} ${IP}`,
      );
    });

    next();
  }
}
