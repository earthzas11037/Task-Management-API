module.exports = {
  database: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'template_api',
    charset: 'utf8mb4_general_ci',
    synchronize: true,
    logging: false,
    ca: '',
  },
  redis: {
    host: 'localhost',
    port: 6379,
    password: 'password',
    disable: false,
  },
  mongo: {
    uri: '',
    type: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    database: 'local_core_api',
    username: '',
    password: '',
    disable: false,
  },
  inboundInterceptor: {
    enabled: false,
    target: 'mongodb',
  },
  credential: {
    prefix: 'userToken',
    secret: 'replace_me',
    expiresIn: 86400, // 1 day
  },
  storage: {
    gcpServiceAccount: '',
    gcpBucketName: 'pbi-public-file',
    gcpBucketPath: 'files',
    localDirectory: './upload',
  },
};
