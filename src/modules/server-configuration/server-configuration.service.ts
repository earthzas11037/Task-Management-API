import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ServerConfigurationEntity } from './entities/server-configuration.entity';

@Injectable()
export class ServerConfigurationService {
  @Inject() private readonly dataSource: DataSource;
  // @Inject() private readonly logger: Logger = new Logger(ServerConfigurationService.name)

  private logger = new Logger(ServerConfigurationService.name);

  private configurationMap: { [key: string]: string } = {};

  @Cron(CronExpression.EVERY_MINUTE)
  private reloadConfiguration() {
    this.logger.log('Reloading Server Configuration...');
    this.loadAllConfiguration();
  }

  private createQueryBuilder() {
    const queryBuilder = this.dataSource.createQueryBuilder(ServerConfigurationEntity, 'server_configuration');
    return queryBuilder;
  }

  getConfig(key: string) {
    return this.configurationMap[key] || '';
  }

  async loadAllConfiguration() {
    const queryBuilder = this.createQueryBuilder();
    const entities = await queryBuilder.getMany();
    const map: { [key: string]: string } = {};
    entities.forEach((entity) => {
      map[entity.key] = entity.value;
    });
    this.logger.log(`Loaded Server Configuration Successfully (${entities.length} configurations)`);
    this.configurationMap = map;
  }
}
