export interface LogData {
  requestId?: string;
  method?: string;
  url?: string;
  headers?: any;
  query?: any;
  params?: any;
  ip?: string;
  userAgent?: string;
  body?: any;
  response?: any;
  statusCode?: number;
  message?: string;
  status?: number;
  metadata?: any;
  processingTimes?: any;
}
