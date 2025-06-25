import { Injectable } from '@nestjs/common';
import { LogData } from 'src/common/interfaces/log/log-data-model.interface';
import { LogRepositoryPort } from 'src/common/interfaces/log/log-repository-port.interface';
import { RedisService } from 'src/infrastructure/database/redis/redis.service';

@Injectable()
export class RedisLogRepositoryAdapter implements LogRepositoryPort {
  constructor(private readonly logRepository: RedisService) {}
  async findByRequestId(requestId: string): Promise<LogData | null> {
    const logData = await this.logRepository.get(requestId);
    return logData ? JSON.parse(logData) : null;
  }
  async create(logData: LogData): Promise<void> {
    await this.logRepository.set(logData.requestId, JSON.stringify(logData));
  }
  async update(requestId: string, logData: LogData): Promise<void> {
    await this.logRepository.set(requestId, JSON.stringify(logData));
  }
}
