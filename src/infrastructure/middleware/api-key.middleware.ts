import { BadRequestException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ServerConfigurationService } from 'src/modules/server-configuration/server-configuration.service';

@Injectable()
export class APIKeyMiddleware implements NestMiddleware {
  constructor(private readonly ServerConfigurationService: ServerConfigurationService) {}
  public async use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'] as string;
    const systemAPIKey = this.ServerConfigurationService.getConfig('system.api.key') || '';
    if (!systemAPIKey) throw new BadRequestException('System API Key is not configured.');
    if (apiKey !== systemAPIKey) throw new UnauthorizedException('API Key is invalid.');
    return next();
  }
}
