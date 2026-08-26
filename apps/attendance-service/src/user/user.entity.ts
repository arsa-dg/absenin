import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  phone!: string | null;

  @Column({ type: 'text', nullable: true })
  position!: string | null;

  @Column({ type: 'text', name: 'photo_key', nullable: true })
  photoKey!: string | null;

  @Column({ default: 'USER' })
  role!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}