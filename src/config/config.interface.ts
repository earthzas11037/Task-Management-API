export interface ConfigInterface {
  database: {
    type: any | string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    charset: string;
    synchronize: boolean;
    logging: boolean;
    ca?: string;
    ssl?: string;
  };
  redis: {
    host: string;
    port: number;
    password: string;
    disable: boolean;
  };
  mongo: {
    uri: string;
    type: 'mongodb';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    disable: boolean;
  };
  inboundInterceptor: {
    enabled: boolean;
    target: 'mongodb' | 'mysql' | 'redis' | 'postgresql';
  };
  credential: {
    prefix: string;
    secret: string;
    expiresIn: number;
  };
  storage: {
    gcpServiceAccount: string;
    gcpBucketName: string;
    gcpBucketPath: string;
    localDirectory: string;
  };
}
