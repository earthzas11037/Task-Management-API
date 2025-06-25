// infrastructure/adapters/mongodb-log-repository.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogRepositoryPort } from 'src/common/interfaces/log/log-repository-port.interface';
import { LogData } from 'src/common/interfaces/log/log-data-model.interface';
import { MongoInboundLogEntity } from '../entities/mongo/mongo-inbound-log.entity';

@Injectable()
export class MongoDBLogRepositoryAdapter implements LogRepositoryPort {
  constructor(
    @InjectRepository(MongoInboundLogEntity, 'mongodbConnection')
    private readonly logRepository: Repository<MongoInboundLogEntity>,
  ) {}
  async findByRequestId(requestId: string): Promise<LogData | null> {
    return this.logRepository.findOne({ where: { requestId } });
  }
  async create(logData: LogData): Promise<void> {
    const log = this.logRepository.create(logData);
    await this.logRepository.save(log);
  }
  async update(requestId: string, logData: LogData): Promise<void> {
    await this.logRepository.update({ requestId }, logData);
  }

  async save(logData: LogData): Promise<void> {
    const log = this.logRepository.create(logData);
    await this.logRepository.save(log);
  }
}
