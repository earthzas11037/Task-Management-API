import { ServerConfigurationService } from 'src/modules/server-configuration/server-configuration.service';
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ProfilingInterceptor implements NestInterceptor {
  @Inject() private readonly ServerConfigurationService: ServerConfigurationService;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isEnabled = this.ServerConfigurationService.getConfig('enable.function.profiling') === '1';
    if (!isEnabled) {
      return next.handle();
    }
    const now = performance.now();
    const handler = context.getHandler();
    const className = context.getClass().name;
    const functionName = handler.name || 'anonymous';

    return next.handle().pipe(
      tap(() => {
        const end = performance.now();
        console.log(`[${className}.${functionName}] Execution Time: ${(end - now).toFixed(2)}ms`);
      }),
    );
  }
}
