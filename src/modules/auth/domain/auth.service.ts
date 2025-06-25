import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { RedisService } from 'src/infrastructure/database/redis/redis.service';
import { UserService } from 'src/modules/user/domain/user.service';
import { comparePassword } from 'src/common/utilities/hash.utility';
import { LoginWithEmailDto } from 'src/modules/auth/domain/dto/login-with-email.dto';
import { UserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { UserAccessTokenService } from 'src/modules/auth/domain/user-access-token.service';

@Injectable()
export class AuthService {
  @Inject() private readonly UserAccessTokenService: UserAccessTokenService;
  @Inject() private readonly UserService: UserService;
  @Inject() private readonly redisService: RedisService;
  @InjectRepository(UserRepository) private readonly repository: Repository<UserEntity>;

  private ENTITY_NAME = 'User Auth';

  async login(dto: LoginWithEmailDto) {
    const user = await this.UserService.getUser({
      email: dto.email,
    });
    if (!user) throw new UnauthorizedException('Unauthorized.');
    const samePassword = comparePassword(dto.password, user.password);
    if (!user || !samePassword) throw new UnauthorizedException('Unauthorized. Invalid phone number or password.');
    const { accessToken } = await this.UserAccessTokenService.setAccessTokenToRedis(user);
    return accessToken;
  }

  async logout(userId: number): Promise<void> {
    await this.UserAccessTokenService.deleteAccessTokenFromRedis(userId);
  }
}
