import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LogRepositoryPort } from 'src/common/interfaces/log/log-repository-port.interface';
import { LogData } from 'src/common/interfaces/log/log-data-model.interface';
import { PostgresqlInboundLogEntity } from '../entities/postgresql/postgresql-inbound-log.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostgresqlLogRepositoryAdapter implements LogRepositoryPort {
  private readonly repository: Repository<PostgresqlInboundLogEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(PostgresqlInboundLogEntity);
  }

  async findByRequestId(requestId: string): Promise<LogData | null> {
    return this.repository.findOneBy({ requestId });
  }

  async create(logData: LogData): Promise<void> {
    const entity = plainToInstance(PostgresqlInboundLogEntity, logData);
    await this.repository.save(entity);
  }

  async update(requestId: string, logData: LogData): Promise<void> {
    const entity = plainToInstance(PostgresqlInboundLogEntity, logData);
    await this.repository.update({ requestId }, entity);
  }
}
