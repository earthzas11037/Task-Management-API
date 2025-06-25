import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cloneDeep } from 'lodash';
import config from 'src/config/config';
import { FileEntity } from 'src/modules/file/domain/entities/file.entity';
import { MySQLInboundLogEntity } from 'src/modules/log/entities/mysql/mysql-inbound-log.entity';
import { ServerConfigurationEntity } from 'src/modules/server-configuration/entities/server-configuration.entity';
import { ServerConfigurationModule } from 'src/modules/server-configuration/server-configuration.module';
import { ServerConfigurationService } from 'src/modules/server-configuration/server-configuration.service';
import { TaskEntity } from 'src/modules/task/domain/entities/task.entity';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';

@Module({
  imports: [
    ServerConfigurationModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const dbConfig = cloneDeep(config.get().database);

        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
          username: dbConfig.username,
          password: dbConfig.password,
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
          ssl: dbConfig.ssl
            ? {
                rejectUnauthorized: false,
              }
            : undefined,
          entities: [FileEntity, ServerConfigurationEntity, MySQLInboundLogEntity, UserEntity, TaskEntity],
        };
      },
    }),
  ],
})
export class PostgresqlModule implements OnModuleInit {
  @Inject() private readonly configurationService: ServerConfigurationService;
  private logger = new Logger(PostgresqlModule.name);

  async onModuleInit() {
    this.logger.log('PostgreSQL Database Initializing...');
    await this.configurationService.loadAllConfiguration();
    this.logger.log('PostgreSQL Database Initialized Successfully');
  }
}
