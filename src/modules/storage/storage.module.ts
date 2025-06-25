import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { ServerConfigurationModule } from '../server-configuration/server-configuration.module';

@Global()
@Module({
  imports: [ConfigModule, ServerConfigurationModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
