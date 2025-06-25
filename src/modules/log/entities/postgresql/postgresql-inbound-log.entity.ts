import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('inbound_logs')
export class PostgresqlInboundLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  requestId: string;

  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'jsonb', nullable: true })
  headers: any;

  @Column({ type: 'jsonb', nullable: true })
  query: any;

  @Column({ type: 'jsonb', nullable: true })
  params: any;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ type: 'jsonb', nullable: true })
  body: any;

  @Column({ type: 'jsonb', nullable: true })
  response: any;

  @Column({ nullable: true })
  statusCode: number;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  status: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({
    name: 'timestamp',
  })
  timestamp: Date;
}
