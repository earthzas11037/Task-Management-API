import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/modules/auth/domain/auth.service';
import { UserAccessTokenService } from 'src/modules/auth/domain/user-access-token.service';
import { AuthController } from 'src/modules/auth/public/auth.controller';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  controllers: [AuthController],
  providers: [AuthService, UserAccessTokenService],
  exports: [AuthService, UserAccessTokenService],
})
export class AuthModule {}
