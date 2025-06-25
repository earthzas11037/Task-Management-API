import { Reflector } from '@nestjs/core';

export enum APIKeyApplicationEnum {
  APP_VERSION = 'app.version',
}

export const APIKeyApplications = Reflector.createDecorator<APIKeyApplicationEnum>();
