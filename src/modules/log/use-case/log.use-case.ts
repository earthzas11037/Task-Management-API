import { ServerConfigurationService } from 'src/modules/server-configuration/server-configuration.service';
import { Injectable } from '@nestjs/common';
import { LogRepositoryPort } from 'src/common/interfaces/log/log-repository-port.interface';
import { LogData } from 'src/common/interfaces/log/log-data-model.interface';

@Injectable()
export class LogService {
  constructor(
    private readonly logRepository: LogRepositoryPort,
    private readonly ServerConfigurationService: ServerConfigurationService,
  ) {}

  async save(requestId: string, logData: LogData): Promise<void> {
    const SHOULD_SKIP = this.ServerConfigurationService.getConfig('skip.inbound.log') === '1';
    if (SHOULD_SKIP) return;
    const existingLog = await this.logRepository.findByRequestId(requestId);
    if (existingLog) {
      // Update the existing log entry
      const updatedLog = { ...existingLog, ...logData };
      await this.logRepository.update(requestId, updatedLog);
    } else {
      // Insert a new log entry
      const newLog = logData;
      await this.logRepository.create(newLog);
    }
  }
}
