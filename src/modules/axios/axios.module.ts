import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AxiosService } from './axios.service'; // Assuming you have an AxiosService
// import { LogModule } from 'src/infrastructure/log/log.module'; // Adjust the path to LogModule
import * as http from 'http';
import * as https from 'https';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
      httpAgent: new http.Agent({
        timeout: 60000,
        keepAlive: true, // Enable keep-alive for persistent connections
      }),
      httpsAgent: new https.Agent({
        timeout: 60000,
        keepAlive: true, // Enable keep-alive for persistent connections
        rejectUnauthorized: false, // Set to `true` for strict SSL verification
      }),
    }),
    // LogModule.register(process.env.MONGODB_IS_DISABLE === 'true'), // Import LogModule
  ],
  providers: [AxiosService],
  exports: [AxiosService],
})
export class AxiosModule {}
