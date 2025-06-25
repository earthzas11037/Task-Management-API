module.exports = {
  database: {
    type: 'DATABASE_TYPE',
    host: 'DATABASE_HOST',
    port: 'DATABASE_PORT',
    username: 'DATABASE_USERNAME',
    password: 'DATABASE_PASSWORD',
    database: 'DATABASE_DATABASE',
    ca: 'DATABASE_SSL_CA',
    synchronize: 'DATABASE_SYNCHRONIZE',
    logging: 'DATABASE_LOGGING',
  },
  redis: {
    host: 'REDIS_HOST',
    port: 'REDIS_PORT',
    password: 'REDIS_PASSWORD',
  },
  mongo: {
    uri: 'MONGO_URI',
    type: 'MONGO_TYPE',
    host: 'MONGO_HOST',
    port: 'MONGO_PORT',
    username: 'MONGO_USERNAME',
    password: 'MONGO_PASSWORD',
    database: 'MONGO_DATABASE',
    disable: 'MONGO_DISABLE',
  },
  inboundInterceptor: {
    enabled: 'INBOUND_INTERCEPTOR_ENABLED',
    target: 'INBOUND_INTERCEPTOR_TARGET',
  },
  credential: {
    prefix: 'CREDENTIAL_PREFIX',
    secret: 'CREDENTIAL_SECRET',
    expiresIn: 'CREDENTIAL_EXPIRES_IN',
  },
  storage: {
    gcpServiceAccount: 'GOOGLE_CLOUD_STORAGE_SERVICE_ACCOUNT',
    gcpBucketName: 'GOOGLE_CLOUD_STORAGE_BUCKET',
    gcpBucketPath: 'GOOGLE_CLOUD_STORAGE_PATH',
    localDirectory: 'LOCAL_UPLOAD_DIRECTORY',
  },
};
