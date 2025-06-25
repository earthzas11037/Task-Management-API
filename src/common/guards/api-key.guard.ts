import { ServerConfigurationService } from './../../modules/server-configuration/server-configuration.service';
import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { APIKeyApplications } from '../decorators/api-key-application.decorator';

@Injectable()
export class APIKeyGuard implements CanActivate {
  @Inject() private readonly ServerConfigurationService: ServerConfigurationService;
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const userApiKey = request.headers['x-api-key'];
    const apiKeyApplicationEnum = this.reflector.get(APIKeyApplications, context.getHandler());
    const configKey = `api.key.${apiKeyApplicationEnum}`;
    const apiKey = this.ServerConfigurationService.getConfig(configKey);
    if (!apiKey || !userApiKey) throw new UnauthorizedException(`No API Key specified. or '${configKey}' config is missing.`);
    return userApiKey === apiKey;
  }
}
