import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerConfigurationEntity } from './entities/server-configuration.entity';
import { ServerConfigurationService } from './server-configuration.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ServerConfigurationEntity])],
  providers: [ServerConfigurationService],
  exports: [ServerConfigurationService],
})
export class ServerConfigurationModule {}
