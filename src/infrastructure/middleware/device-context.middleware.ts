import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DeviceContextInterface } from 'src/common/constants/context.constants';

@Injectable()
export class DeviceContextMiddleware implements NestMiddleware {
  constructor() {}
  public async use(req: Request, res: Response, next: NextFunction) {
    req['device_context'] = {
      deviceId: req.headers['x-device-id'] as string,
      deviceType: req.headers['x-device-type'] as string,
    } as DeviceContextInterface;

    return next();
  }
}
