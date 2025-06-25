/** IMPORTANT: Need to execute first to load .env */
import * as dotenv from 'dotenv';
dotenv.config({ debug: true });
/** */

import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';

import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import moment from 'moment-timezone';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './infrastructure/filters/global-exception.filter';
import { ProfilingInterceptor } from './infrastructure/interceptors/function-profiling.interceptor';
import { CleanDtoPipe } from './infrastructure/pipes/clear-dto.global-pipe';
import { ServerConfigurationService } from './modules/server-configuration/server-configuration.service';

moment.tz.setDefault('Asia/Bangkok');

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'fatal', 'log', 'verbose', 'warn'],
  });

  app.useGlobalFilters(new GlobalExceptionFilter()); // Global Error Handling

  // Global Error Handling for Unhandled Promise Rejections
  process.on('unhandledRejection', (reason, promise) => {
    Logger.error(`🔥 Unhandled Promise Rejection: ${reason}`, promise as any);
  });

  process.on('uncaughtException', (error) => {
    Logger.error(`🔥 Uncaught Exception: ${error.message}`, error.stack);
    process.exit(1); // Optional: Restart server in case of fatal error
  });

  app.enableCors();

  /** This allow interceptor able to use ServerConfigurationService inside */
  const profilingInterceptor = app.get(ProfilingInterceptor); // Retrieve from DI container
  app.useGlobalInterceptors(profilingInterceptor); // Apply glob

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
    /** Clear all undefined or null value from DTO before being processed by Controllers. */
    // new CleanDtoPipe(),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Template API')
    .addBearerAuth(
      {
        description: `Enter token from login api (without Bearer prefix only swagger) but postman should be start with Bearer (space) (token)`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, { swaggerOptions: { persistAuthorization: true } });

  try {
    await app.listen(process.env.PORT || 5000, () => {
      logger.log(`Server is running on PORT ${process.env.PORT || 5000}`);
    });
  } catch (error) {
    logger.error('Error during bootstrap initialization', error);
    process.exit(1); // Exit process on error
  }
}
bootstrap();
