import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity()
export class RefreshToken {
  @PrimaryColumn()
  id: string = uuidv7();

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  jti: string;

  @Column()
  device: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: false, name: 'expires_at' })
  expiresAt: Date;
}
