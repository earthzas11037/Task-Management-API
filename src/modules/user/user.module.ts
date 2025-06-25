import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { UserService } from 'src/modules/user/domain/user.service';
import { UserController } from 'src/modules/user/public/user.controller';
import { UserRepository } from 'src/modules/user/domain/repositories/user.repository';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserRepository, UserService],
})
export class UserModule {}
