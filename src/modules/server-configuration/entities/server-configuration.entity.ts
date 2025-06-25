import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('server_configurations')
export class ServerConfigurationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  key: string;

  @Column({ type: 'varchar', length: 4000 })
  value: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;
}
