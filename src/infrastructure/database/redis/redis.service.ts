import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import RedisMock from 'ioredis-mock'; // Import the mock
import config from 'src/config/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  async onModuleInit() {
    const redisConfig = config.get().redis;
    const isTestEnv = process.env.NODE_ENV === 'jest'; // Detect the environment
    if (!redisConfig.disable) {
      if (!isTestEnv) {
        this.client = new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
          retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });
      } else {
        // Use mock client in test environment
        this.client = new RedisMock();
      }

      this.client.on('connect', () => {
        this.logger.log('Redis connected');
      });

      this.client.on('error', (err) => {
        this.logger.error('Redis connection error: ' + err);
      });

      this.client.on('close', () => {
        this.logger.warn('Redis connection closed');
      });

      this.client.on('reconnecting', (delay) => {
        this.logger.warn(`Redis reconnecting... Next attempt in ${delay}ms`);
      });
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
        this.logger.log('Redis connection closed');
      } catch (err) {
        this.logger.error('Error closing Redis connection: ' + err);
      }
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return this.client ? await this.client.get(key) : null;
    } catch (err) {
      this.logger.error(`Error getting key ${key}: ${err}`);
      return null;
    }
  }

  async set(key: string, value: string, expire?: number): Promise<void> {
    try {
      if (this.client) {
        await this.client.set(key, value, 'EX', expire);
      }
    } catch (err) {
      this.logger.error(`Error setting key ${key}: ${err}`);
    }
  }

  async del(key: string): Promise<number> {
    try {
      if (this.client) {
        return await this.client.del(key);
      }
      return 0;
    } catch (err) {
      this.logger.error(`Error deleting key ${key}: ${err}`);
      return 0;
    }
  }

  async sismember(key: string, value: string): Promise<boolean> {
    try {
      if (!this.client) return false;
      const result = await this.client.sismember(key, value);
      return result === 1;
    } catch (err) {
      this.logger.error(`Error checking sismember for key ${key} and value ${value}: ${err}`);
      return false;
    }
  }

  async sadd(key: string, ...values: string[]): Promise<number> {
    try {
      if (!this.client) return 0;
      const result = await this.client.sadd(key, ...values);
      return result;
    } catch (err) {
      this.logger.error(`Error adding members to set ${key}: ${err}`);
      return 0;
    }
  }
}
