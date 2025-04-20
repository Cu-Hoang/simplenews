import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
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
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date;
}
