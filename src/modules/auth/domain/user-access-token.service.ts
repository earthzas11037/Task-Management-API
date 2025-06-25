import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { RedisService } from 'src/infrastructure/database/redis/redis.service';
import { ServerConfigurationService } from 'src/modules/server-configuration/server-configuration.service';
import { UserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { TokenPayload } from 'src/common/interfaces/token-payload.interface';
import { UserRoleEnum } from 'src/common/constants/user-role.enum';
import config from 'src/config/config';

@Injectable()
export class UserAccessTokenService {
  @Inject() private readonly redisService: RedisService;
  @Inject() private readonly ServerConfigurationService: ServerConfigurationService;
  @Inject() private readonly repository: UserRepository;

  async setUserAccessToken(userId: number) {
    let user: UserEntity;
    let response: TokenPayload;
    user = await this.repository.findOne({ where: { id: userId } });
    response = {
      userId: user.id,
      email: user.email,
      type: user.role,
    };

    return this.setAccessTokenToRedis(user);
  }

  async setAccessTokenToRedis(user: UserEntity) {
    const response: TokenPayload = {
      userId: user.id,
      email: user.email,
      type: user.role,
    };

    const secret = this.secret();
    const expiresIn = this.expiresIn();

    const accessToken = jwt.sign(response, secret, {
      expiresIn: expiresIn,
    });

    const prefix = this.keyPrefix();
    const section = prefix + ':' + user.id;

    await this.redisService.set(section, accessToken, expiresIn);

    return { accessToken, ...response };
  }

  async deleteAccessTokenFromRedis(userId: number): Promise<void> {
    const prefix = this.keyPrefix();
    const section = `${prefix}:${userId}`;

    const isDeleted = await this.redisService.del(section);

    if (!isDeleted) {
      throw new Error('Logout failed: Token not found or already expired');
    }
  }

  /** Verify token and ensure it's still in Redis (active) */
  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const secret = this.secret();
      jwt.verify(token, secret);

      const payload = jwt.decode(token) as TokenPayload;
      const prefix = this.keyPrefix();
      const redisKey = `${prefix}:${payload.userId}`;

      const exists = await this.redisService.get(redisKey);
      if (!exists) {
        throw new UnauthorizedException('Token was incorrect or has expired');
      }

      return payload;
    } catch (err) {
      throw new UnauthorizedException('Token was incorrect or has expired');
    }
  }

  private secret() {
    return this.ServerConfigurationService.getConfig('user.access.token.secret') || config.get().credential.secret;
  }

  private expiresIn() {
    return (
      parseInt(this.ServerConfigurationService.getConfig('user.access.token.expired.in')) || config.get().credential.expiresIn || 86400 /** Default = 1 day */
    );
  }

  keyPrefix(): string {
    return this.ServerConfigurationService.getConfig('user.access.token.key.prefix') || config.get().credential.prefix;
  }
}
