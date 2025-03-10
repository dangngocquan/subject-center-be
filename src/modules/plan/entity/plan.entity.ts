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
import { PlanItemEntity } from './plan-item.entity';
import { AccountEntity } from '../../user/entity/account.entity';

@Entity({ name: 'plan' })
export class PlanEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name?: string;

  @Column({
    type: 'bigint',
    name: 'account_id',
  })
  accountId: number;

  @Column({
    type: 'float',
    default: () => 'extract(epoch from now())',
    name: 'order_index',
  })
  orderIndex?: number;

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

  @ManyToOne(() => AccountEntity, (account) => account.plans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;

  @OneToMany(() => PlanItemEntity, (item) => item.plan)
  items: PlanItemEntity[];
}
