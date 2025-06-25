import { Module, DynamicModule, Global, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';
import { MongoInboundLogEntity } from 'src/modules/log/entities/mongo/mongo-inbound-log.entity';

@Global()
@Module({})
export class MongoModule implements OnModuleInit {
  private logger = new Logger(MongoModule.name);
  static register(): DynamicModule {
    const mongoConfig = config.get().mongo;

    // If MongoDB is disabled, return an empty module
    if (mongoConfig.disable) {
      return {
        module: MongoModule,
        providers: [],
        exports: [],
      };
    }

    const url =
      mongoConfig.uri ||
      `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}/${mongoConfig.database}?directConnection=true&authSource=${mongoConfig.database}`;

    return {
      module: MongoModule,
      imports: [
        TypeOrmModule.forRoot({
          type: mongoConfig.type,
          url,
          entities: [MongoInboundLogEntity],
          name: 'mongodbConnection', // Set the custom connection name
        }),
        TypeOrmModule.forFeature([MongoInboundLogEntity], 'mongodbConnection'), // Reference the custom connection here
      ],
      providers: [],
      exports: [TypeOrmModule], // Export the repository and the connection
    };
  }

  async onModuleInit() {
    this.logger.log('MongoDB Initialized Successfully');
  }
}
