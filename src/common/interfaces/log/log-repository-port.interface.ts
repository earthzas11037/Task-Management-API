import { LogData } from './log-data-model.interface';

export interface LogRepositoryPort {
  findByRequestId(requestId: string): Promise<LogData | null>;
  create(logData: LogData): Promise<void>;
  update(requestId: string, logData: LogData): Promise<void>;
}

export const LOG_REPOSITORY_PORT = Symbol('LogRepositoryPort');
