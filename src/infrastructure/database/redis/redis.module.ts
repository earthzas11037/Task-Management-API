import { Module, Global, DynamicModule } from '@nestjs/common';
import { RedisService } from './redis.service';
import config from 'src/config/config';

@Global()
@Module({})
export class RedisModule {
  static register(): DynamicModule {
    const providers = config.get().redis.disable ? [] : [RedisService];

    return {
      module: RedisModule,
      providers,
      exports: providers,
    };
  }
}
