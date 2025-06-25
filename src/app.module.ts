import { Inject, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestContextModule } from 'nestjs-request-context';
import config from './config/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ProfilingInterceptor } from './infrastructure/interceptors/function-profiling.interceptor';
import { InboundInterceptor } from './infrastructure/interceptors/inbound.interceptor';
import { AccessMatrixMiddleware } from './infrastructure/middleware/access-matrix.middleware';
import { APIKeyMiddleware } from './infrastructure/middleware/api-key.middleware';
import { DeviceContextMiddleware } from './infrastructure/middleware/device-context.middleware';
import { HTTPLoggerMiddleware } from './infrastructure/middleware/http-logger.middleware';
import { AxiosModule } from './modules/axios/axios.module';
import { LogModule } from './modules/log/log.module';
import { ServerConfigurationModule } from './modules/server-configuration/server-configuration.module';
import { ServerConfigurationService } from './modules/server-configuration/server-configuration.service';
import { FileModule } from 'src/modules/file/file.module';
import { PresentationModule } from 'src/presentation/presentation.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { UserContextMiddleware } from 'src/infrastructure/middleware/user-context.middleware';
import { TaskModule } from 'src/modules/task/task.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    ServerConfigurationModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 20,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    LogModule.register(config.get().inboundInterceptor.target || 'mongodb'),
    RequestContextModule,
    AxiosModule,
    PresentationModule,

    FileModule,
    AuthModule,
    TaskModule,
    UserModule,
  ],
  providers: [
    ...(config.get().inboundInterceptor.enabled
      ? [
          {
            provide: APP_INTERCEPTOR,
            useClass: InboundInterceptor,
          },
        ]
      : []),
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    FileModule,
    /** This allow interceptor able to use ServerConfigurationService inside */
    ServerConfigurationService,
    ProfilingInterceptor,
  ],
  /** This allow interceptor able to use ServerConfigurationService inside */
  exports: [ServerConfigurationService],
})
export class AppModule implements NestModule {
  @Inject() private readonly ServerConfigurationService: ServerConfigurationService;

  async configure(consumer: MiddlewareConsumer) {
    /** Load All Configuration before initialize middlewares */
    await this.ServerConfigurationService.loadAllConfiguration();

    /** Apply HTTP Logger for debugging purpose */
    consumer.apply(HTTPLoggerMiddleware, DeviceContextMiddleware).forRoutes('*');
    consumer.apply(APIKeyMiddleware).forRoutes({ path: 'admin/auth/create', method: RequestMethod.POST }, { path: 'internal/*', method: RequestMethod.ALL });
    consumer
      .apply(UserContextMiddleware)
      .exclude(
        { path: 'public/(.*)', method: RequestMethod.GET },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/signup', method: RequestMethod.POST },
        { path: 'internal/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*');
    consumer.apply(AccessMatrixMiddleware).forRoutes('*');
  }
}
