import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Role } from './enum/role';

@Entity()
export class User {
  @PrimaryColumn()
  id: string = uuidv7();

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.READER })
  role: Role;

  @Column({ type: 'int', default: 0 })
  freeArticlesRead: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastReadReset: Date;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ type: 'timestamp', nullable: true })
  premiumExpiry: Date;

  @Column({ nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
