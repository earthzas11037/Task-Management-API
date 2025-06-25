import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { validate } from 'class-validator';
import { plainToClass, ClassTransformOptions } from 'class-transformer';

@Injectable()
export class ResponseValidationInterceptor<T extends object> implements NestInterceptor {
  constructor(private readonly dto: new () => T) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(switchMap((data) => from(this.validateAndTransformResponse(data))));
  }

  private async validateAndTransformResponse(data: any): Promise<any> {
    const transformOptions: ClassTransformOptions = {
      excludeExtraneousValues: true, // Exclude fields not defined in the DTO
    };

    // Transform data
    const instance = plainToClass(this.dto, data.data, transformOptions);
    // Validate the transformed instance
    const errors = await validate(instance);

    if (errors.length > 0) {
      const validationMessages = errors.flatMap((err) => Object.values(err.constraints || {}));

      throw new BadRequestException({
        message: validationMessages,
      });
    }

    return {
      ...data,
      data: instance,
    };
  }
}
