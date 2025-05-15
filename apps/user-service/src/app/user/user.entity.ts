import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Role } from '../enum/role';

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

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.READER] })
  roles: Role[];

  @Column({ type: 'int', default: 0, name: 'free_articles_read' })
  freeArticlesRead: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'last_read_reset' })
  lastReadReset: Date;

  @Column({ default: false, name: 'is_premium' })
  isPremium: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'premium_expiry' })
  premiumExpiry: Date;

  @Column({ nullable: true, name: 'avatar_url' })
  avatarUrl: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
