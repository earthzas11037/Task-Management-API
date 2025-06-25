import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class EmptyInterceptor implements NestInterceptor {
  constructor() {}
  async intercept(context: ExecutionContext, handler: CallHandler): Promise<Observable<any>> {
    return handler.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
