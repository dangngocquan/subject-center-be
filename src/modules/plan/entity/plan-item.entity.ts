import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanEntity } from './plan.entity';

@Entity({ name: 'plan_item' })
export class PlanItemEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'plan_id',
  })
  planId: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'code',
  })
  code?: string;

  @Column({
    type: 'bigint',
    name: 'credit',
    default: 0,
    nullable: false,
  })
  credit?: number;

  @Column({
    type: 'float',
    name: 'grade4',
    nullable: true,
  })
  grade4?: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'gradeLatin',
  })
  gradeLatin?: string;

  @Column({
    type: 'text',
    array: true,
    default: [],
    name: 'prerequisites',
  })
  prerequisites?: string[];

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

  @ManyToOne(() => PlanEntity, (plan) => plan.items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'plan_id' })
  plan: PlanEntity;
}
