import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  service!: string;

  @Column({ type: 'text' })
  action!: string;

  @Column({ type: 'text', name: 'user_id' })
  userId!: string;

  @Column({ type: 'timestamptz', name: 'occurred_at' })
  occurredAt!: Date;

  @Column({ name: 'updated_fields', type: 'text', array: true, default: '{}' })
  updatedFields!: string[];

  @Column({ type: 'jsonb', default: '{}' })
  changes!: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}