import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AccessMatrixMiddleware implements NestMiddleware {
  constructor() {}
  public async use(req: Request, res: Response, next: NextFunction) {
    return next();
  }
}
