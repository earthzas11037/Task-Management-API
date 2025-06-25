import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LogRepositoryPort } from 'src/common/interfaces/log/log-repository-port.interface';
import { LogData } from 'src/common/interfaces/log/log-data-model.interface';
import { MySQLInboundLogEntity } from '../entities/mysql/mysql-inbound-log.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MySQLLogRepositoryAdapter implements LogRepositoryPort {
  private readonly repository: Repository<MySQLInboundLogEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(MySQLInboundLogEntity);
  }

  async findByRequestId(requestId: string): Promise<LogData | null> {
    return this.repository.findOneBy({ requestId });
  }

  async create(logData: LogData): Promise<void> {
    logData = plainToInstance(MySQLInboundLogEntity, logData);
    await this.repository.save(logData);
  }

  async update(requestId: string, logData: LogData): Promise<void> {
    logData = plainToInstance(MySQLInboundLogEntity, logData);
    await this.repository.update({ requestId }, logData);
  }
}
