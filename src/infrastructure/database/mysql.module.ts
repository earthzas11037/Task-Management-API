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
        const dbConfig = cloneDeep(config.get().database); // Clone the config to make it mutable

        return {
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
          ...{
            type: dbConfig.type,
            host: dbConfig.host,
            port: dbConfig.port,
            database: dbConfig.database,
            username: dbConfig.username,
            password: dbConfig.password,
            charset: dbConfig.charset,
            ...(dbConfig.ca
              ? {
                  // SSL Configuration with Base64 Decoding
                  ssl: {
                    ca: Buffer.from(dbConfig.ca || '', 'base64'),
                    rejectUnauthorized: true,
                  },
                }
              : {}),
          },
          entities: [FileEntity, ServerConfigurationEntity, MySQLInboundLogEntity, UserEntity, TaskEntity],
        };
      },
    }),
  ],
})
export class MysqlModule implements OnModuleInit {
  @Inject() private readonly configurationService: ServerConfigurationService;
  private logger = new Logger(MysqlModule.name);

  async onModuleInit() {
    this.logger.log('MySQL Database Initializing...');
    await this.configurationService.loadAllConfiguration();
    this.logger.log('MySQL Database Initialized Successfully');
  }
}
