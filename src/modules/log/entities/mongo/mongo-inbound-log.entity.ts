// mongo-inbound-log.entity.ts
import { Entity, Column, ObjectIdColumn, ObjectId, Index } from 'typeorm';

@Entity('inbound_logs')
export class MongoInboundLogEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: true })
  @Index({ unique: true }) // Index requestId for faster lookup
  requestId?: string;

  @Column({ nullable: true })
  method?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ type: 'json', nullable: true })
  headers?: any;

  @Column({ type: 'json', nullable: true })
  query?: any;

  @Column({ type: 'json', nullable: true })
  params?: any;

  @Column({ nullable: true })
  ip?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ type: 'json', nullable: true })
  body?: any;

  @Column({ type: 'json', nullable: true })
  response?: any;

  @Column({ nullable: true })
  statusCode?: number;

  @Column({ nullable: true })
  message?: string;

  @Column({ nullable: true })
  status?: number;

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @Column()
  timestamp: Date;
}
