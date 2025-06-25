import _config from 'config';
import { ConfigInterface } from './config.interface';

const config: ConfigInterface = {
  database: _config.get('database'),
  redis: _config.get('redis'),
  mongo: _config.get('mongo'),
  inboundInterceptor: {
    enabled: String(_config.get('inboundInterceptor.enabled')) === 'true',
    target: _config.get('inboundInterceptor.target'),
  },
  credential: _config.get('credential'),
  storage: _config.get('storage'),
};

function get() {
  return config;
}

export default { get };
