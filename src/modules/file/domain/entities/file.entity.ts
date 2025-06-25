import { APIResponse } from 'src/common/interfaces/api-response.interface';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';

@Entity('files')
export class FileEntity implements APIResponse {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alternativeText: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  caption: string;

  @Column({ type: 'int', nullable: true })
  width: number;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'json', nullable: true })
  formats: object;

  @Column({ type: 'varchar', length: 255, nullable: true })
  hash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ext: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mime: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'In KB' })
  size: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  previewUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  provider: string;

  @Column({ type: 'json', nullable: true })
  providerMetadata: object;

  @Column({ type: 'varchar', length: 255, nullable: true })
  folderPath: string;

  @CreateDateColumn({ type: 'timestamp', precision: 6, nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6, nullable: true })
  updatedAt: Date;

  @Column({ type: 'text', nullable: true })
  placeholder: string;

  @Column({ type: 'text', nullable: true })
  token: string;

  @Column({ type: 'json', nullable: true })
  detail: object;

  @Column({ nullable: true })
  createdById: number;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @Column({ nullable: true })
  updatedById: number;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: UserEntity;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  toAPIResponse() {
    return {
      id: this.id,
      name: this.name,
      ext: this.ext,
      size: this.size,
      width: this.width,
      height: this.height,
      url: this.url,
      // token: this.token,
      // detail: this.detail,
    };
  }
}
