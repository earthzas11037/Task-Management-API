import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere, In } from 'typeorm';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';

import _ from 'lodash';
import { UserRoleEnum } from 'src/common/constants/user-role.enum';
import { UserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { ServerConfigurationService } from 'src/modules/server-configuration/server-configuration.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { queryBuilderWithPagination } from 'src/common/utilities/datasource.utility';
import { PaginationMetaDto } from 'src/common/dtos/pagination-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { createHashedPassword } from 'src/common/utilities/hash.utility';
import { SignUpRequestDTO } from 'src/modules/auth/domain/dto/signup-request.dto';

@Injectable()
export class UserService {
  @Inject() private readonly dataSource: DataSource;
  @Inject() private readonly UserRepository: UserRepository;

  private createQueryBuilder() {
    return this.dataSource.createQueryBuilder(UserEntity, 'users');
  }

  async getAllUsers(pagination: PaginationDto) {
    const qb = this.createQueryBuilder();
    const [entities, count] = await queryBuilderWithPagination(qb, pagination, ['users.email'], {}, {}).getManyAndCount();
    return new PageDto(entities, new PaginationMetaDto({ itemCount: count, pagination }));
  }

  async getUser(where: FindOptionsWhere<UserEntity>) {
    return this.UserRepository.findOne({ where });
  }

  async getUserByEmail(email: string) {
    return this.getUser({ email });
  }

  private async buildBaseUser(partial: Partial<UserEntity>): Promise<UserEntity> {
    // 1. Create user entity
    const user = this.UserRepository.create(partial);
    await this.UserRepository.save(user);

    // create profile //

    //Reload full user with necessary relations (but not recursive!)
    return this.getUser({ id: user.id });
  }

  async createUser(dto: SignUpRequestDTO) {
    let existingUser = await this.getUserByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('User is already.');
    }

    return this.buildBaseUser({
      email: dto.email,
      password: createHashedPassword(dto.password),
    });
  }

  async updateUserRole(userId: number, role: UserRoleEnum) {
    const user = await this.getUser({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    user.role = role;
    return this.UserRepository.save(user);
  }

  async updateUserPassword(userId: number, password: string) {
    const user = await this.getUser({ id: userId });
    user.password = createHashedPassword(password);
    return this.UserRepository.save(user);
  }

  async updateUser(updateValue: Partial<UserEntity>) {
    const user = await this.getUser({ id: updateValue.id });
    return this.UserRepository.save(this.UserRepository.merge(user, updateValue));
  }

  async softDelete(ids: number[]) {
    const users = await this.UserRepository.find({
      where: { id: In(ids) },
      relations: ['userProfile'],
    });

    if (users.length === 0) throw new BadRequestException(`No users found.`);
    if (ids.length !== users.length) throw new BadRequestException(`Unauthorized to some users.`);

    return this.dataSource.manager.softRemove(users);
  }
}
