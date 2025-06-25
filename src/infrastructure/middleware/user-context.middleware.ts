import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserAccessTokenService } from 'src/modules/auth/domain/user-access-token.service';

@Injectable()
export class UserContextMiddleware implements NestMiddleware {
  constructor(private readonly userAccessTokenService: UserAccessTokenService) {}
  public async use(req: Request, res: Response, next: NextFunction) {
    req['middlewareStartTime'] = Date.now();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization Header');
    }
    try {
      const [tokenType, token] = authHeader.split(' ');
      if (!(tokenType === 'Bearer' && token)) {
        throw new UnauthorizedException('Token was incorrect or it has been expired');
      }

      const payload = await this.userAccessTokenService.verifyAccessToken(token);
      if (payload) {
        req['user_context'] = {
          user: payload,
        };
      }
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
