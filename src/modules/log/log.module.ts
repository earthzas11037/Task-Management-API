import { Module, DynamicModule, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';
import { LOG_REPOSITORY_PORT } from 'src/common/interfaces/log/log-repository-port.interface';
import { MySQLLogRepositoryAdapter } from './adapters/mysql-log-repository.adapter';
import { MongoDBLogRepositoryAdapter } from './adapters/mongodb-log-repository.adapter';
import { RedisLogRepositoryAdapter } from './adapters/redis-log-repository.adapter';
import { NoOpLogRepositoryAdapter } from './adapters/no-log-repository.adapter';
import { LogService } from './use-case/log.use-case';
import { MySQLInboundLogEntity } from './entities/mysql/mysql-inbound-log.entity';
import { MongoInboundLogEntity } from './entities/mongo/mongo-inbound-log.entity';
import { PostgresqlLogRepositoryAdapter } from 'src/modules/log/adapters/postgresql-log-repository.adapter';
import { PostgresqlInboundLogEntity } from 'src/modules/log/entities/postgresql/postgresql-inbound-log.entity';
import { ServerConfigurationService } from 'src/modules/server-configuration/server-configuration.service';

const STORAGE_TYPES = {
  MYSQL: 'mysql',
  MONGODB: 'mongodb',
  REDIS: 'redis',
  POSTGRESQL: 'postgresql',
};

@Module({})
export class LogModule {
  static register(storage: 'mysql' | 'mongodb' | 'redis' | 'postgresql'): DynamicModule {
    const { adapter, imports } = this.getAdapterAndImports(storage);

    return {
      module: LogModule,
      imports,
      providers: [
        { provide: LOG_REPOSITORY_PORT, useClass: adapter },
        {
          provide: LogService,
          useFactory: (logRepository, serverConfigurationService: ServerConfigurationService) => new LogService(logRepository, serverConfigurationService),
          inject: [LOG_REPOSITORY_PORT, ServerConfigurationService],
        },
      ],

      exports: [LogService],
    };
  }

  private static getAdapterAndImports(storage: string): { adapter: Type<any>; imports: any[] } {
    switch (storage) {
      case STORAGE_TYPES.MYSQL:
        return {
          adapter: MySQLLogRepositoryAdapter,
          imports: [TypeOrmModule.forFeature([MySQLInboundLogEntity])],
        };
      case STORAGE_TYPES.MONGODB:
        return {
          adapter: config.get().mongo.disable ? NoOpLogRepositoryAdapter : MongoDBLogRepositoryAdapter,
          imports: config.get().mongo.disable ? [] : [TypeOrmModule.forFeature([MongoInboundLogEntity])],
        };
      case STORAGE_TYPES.REDIS:
        return {
          adapter: config.get().redis.disable ? NoOpLogRepositoryAdapter : RedisLogRepositoryAdapter,
          imports: [],
        };
      case STORAGE_TYPES.POSTGRESQL:
        return {
          adapter: PostgresqlLogRepositoryAdapter,
          imports: [TypeOrmModule.forFeature([PostgresqlInboundLogEntity])],
        };
      default:
        return {
          adapter: NoOpLogRepositoryAdapter,
          imports: [],
        };
    }
  }
}
