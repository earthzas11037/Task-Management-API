import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { APIResponse } from 'src/common/interfaces/api-response.interface';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { FileEntity } from 'src/modules/file/domain/entities/file.entity';
import { APISortableFieldType } from 'src/common/types/api-sortable-field.type';

export enum TaskStatusEnum {
  INCOMPLETED = 'INCOMPLETED',
  COMPLETED = 'COMPLETED',
}

@Entity('tasks')
export class TaskEntity implements APIResponse {
  static sortableFields: APISortableFieldType = {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  };

  static filterableFields: APISortableFieldType = {};

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TaskStatusEnum, default: TaskStatusEnum.INCOMPLETED })
  status: TaskStatusEnum;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @ManyToMany(() => FileEntity)
  @JoinTable({
    name: 'task_images',
    joinColumn: { name: 'task_id' },
    inverseJoinColumn: { name: 'file_id' },
  })
  images: FileEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  toAPIResponse() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      images: this.images?.map((i) => i.toAPIResponse()) ?? [],
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
