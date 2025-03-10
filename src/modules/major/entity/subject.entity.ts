import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MajorEntity } from './major.entity';

@Entity({ name: 'subject' })
export class SubjectEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'major_id',
  })
  majorId: number;

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

  @ManyToOne(() => MajorEntity, (major) => major.subjects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'major_id' })
  major: MajorEntity;
}
