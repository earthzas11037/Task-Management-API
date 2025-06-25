import { Logger } from '@nestjs/common';
import { LogData } from 'src/common/interfaces/log/log-data-model.interface';
import { LogRepositoryPort } from 'src/common/interfaces/log/log-repository-port.interface';

export class NoOpLogRepositoryAdapter implements LogRepositoryPort {
  private logger = new Logger(NoOpLogRepositoryAdapter.name);
  async findByRequestId(requestId: string): Promise<any> {
    this.logger.debug('No operation Log Repository');
    return null;
  }

  async create(logData: LogData): Promise<void> {
    // No operation
    this.logger.debug('No operation Log Repository');
  }

  async update(requestId: string, logData: LogData): Promise<void> {
    // No operation
    this.logger.debug('No operation Log Repository');
  }
}
