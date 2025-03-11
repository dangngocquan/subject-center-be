import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EPlatformProvider } from '../type/user.type';
import { UserEntity } from './user.entity';
import { PlanEntity } from '../../plan/entity/plan.entity';

@Entity({ name: 'account' })
export class AccountEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'varchar',
    name: 'key',
    length: 255,
    nullable: false,
  })
  key: string;

  @Column({
    name: 'provider',
    type: 'varchar',
    length: 255,
    nullable: false,
    default: EPlatformProvider.GOOGLE,
  })
  provider: EPlatformProvider;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, (u) => u.accounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => PlanEntity, (plan) => plan.account)
  plans: PlanEntity[];
}
