import { Module } from '@nestjs/common';
import { MysqlModule } from './mysql.module';
import { RedisModule } from './redis/redis.module';
import { MongoModule } from './mongo.module';
import { PostgresqlModule } from 'src/infrastructure/database/postgresql.module';

@Module({
  imports: [
    MysqlModule,
    // PostgresqlModule,
    RedisModule.register(), // Register RedisModule here
    MongoModule.register(),
  ],
  exports: [
    MysqlModule,
    // PostgresqlModule,
    RedisModule,
    MongoModule,
  ],
})
export class DatabaseModule {}
