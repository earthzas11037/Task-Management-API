import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import _ from 'lodash';
import { APIResponse } from 'src/common/interfaces/api-response.interface';
import { UserRoleEnum } from 'src/common/constants/user-role.enum';

@Entity('users')
export class UserEntity implements APIResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  toAPIResponse = () => {
    const response = {
      userId: this.id,
      email: this.email,
      role: this.role,
    };

    return response;
  };
}
