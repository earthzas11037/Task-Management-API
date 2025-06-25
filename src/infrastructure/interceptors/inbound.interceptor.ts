import { CallHandler, ExecutionContext, HttpException, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { LogService } from 'src/modules/log/use-case/log.use-case';
import { LogData } from 'src/common/interfaces/log/log-data-model.interface';
import { get } from 'lodash';
import config from 'src/config/config';

@Injectable()
export class InboundInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InboundInterceptor.name);

  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers, query, params, ip, body } = request;
    const requestId = request.requestId || uuidv4();
    const userAgent = headers['user-agent'] || 'unknown';

    // Capture timing details
    const requestStartTime = request['middlewareStartTime'] || Date.now();
    const controllerStartTime = Date.now();

    // Log inbound request
    this.logRequest(requestId, { method, url, headers, query, params, ip, userAgent, body });

    return next.handle().pipe(
      map((responseBody) => {
        // Calculate processing times
        const processingTimes = this.calculateProcessingTimes(requestStartTime, controllerStartTime);

        // Log outbound response
        this.logResponse(requestId, responseBody, url);

        // Return enhanced response
        return {
          ...responseBody,
          requestId,
          processingTime: processingTimes,
        };
      }),
      catchError((err) => {
        console.error(err);
        const processingTimes = this.calculateProcessingTimes(requestStartTime, controllerStartTime);

        const statusCode = err.response?.statusCode || err.status || 500;
        const message = err.response?.message || err.message || 'Internal server error';
        const messageKey = err.response?.messageKey || err.messageKey || '';

        // Log the error
        this.logError(requestId, { method, url, statusCode, message, processingTimes });

        // Create and throw enhanced error response
        const errorResponse = {
          statusCode,
          message,
          messageKey,
          requestId,
          processingTime: processingTimes,
        };

        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }

  private logRequest(requestId: string, data: Partial<LogData>) {
    if (this.shouldSkipLogging(data.url)) return;
    const log: LogData = { requestId, ...data, message: `Inbound ${data.method} ${data.url}` };
    this.logService.save(requestId, log);
    this.logger.log(`Request logged: ${log.message}`);
  }

  private logResponse(requestId: string, responseBody: any, url: string) {
    if (this.shouldSkipLogging(url)) return;
    const log: LogData = {
      requestId,
      response: responseBody,
      message: `Outbound response for ${requestId}`,
    };
    this.logService.save(requestId, log);
    this.logger.log(`Response logged: ${log.message}`);
  }

  private shouldSkipLogging(url?: string): boolean {
    if (!url) return false;
    const ignoredPatterns = [/^\/auth\//, /^\/internal\//];
    return ignoredPatterns.some((pattern) => pattern.test(url));
  }

  private logError(requestId: string, data: Partial<LogData>) {
    const { method, url, statusCode, message, processingTimes } = data;
    const log: LogData = {
      requestId,
      statusCode,
      response: message,
      message: `Error in ${method} ${url} - ${processingTimes.total}`,
    };
    this.logService.save(requestId, log);
    this.logger.error(`Error logged: ${log.message}`);
  }

  private calculateProcessingTimes(start: number, controllerStart: number) {
    const middlewareTime = controllerStart - start;
    const controllerTime = Date.now() - controllerStart;
    const total = middlewareTime + controllerTime;
    return {
      middleware: `${middlewareTime}ms`,
      controller: `${controllerTime}ms`,
      total: `${total}ms`,
    };
  }
}
