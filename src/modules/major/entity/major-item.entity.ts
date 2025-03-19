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

@Entity({ name: 'major_item' })
export class MajorItemEntity {
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
    type: 'text',
    array: true,
    default: [],
    name: 'prerequisites',
    nullable: true,
  })
  prerequisites?: string[];

  @Column({
    type: 'float',
    default: () => 'extract(epoch from now())',
    name: 'order_index',
  })
  orderIndex?: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'gen_code',
    nullable: false,
  })
  genCode: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'parent_gen_code',
    nullable: true,
  })
  parentGenCode: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'stt',
    nullable: false,
  })
  stt: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'course_code',
    nullable: true,
  })
  code: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'name_vn',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'int',
    name: 'credits',
    nullable: true,
  })
  credit: number | null;

  @Column({
    type: 'int',
    name: 'level',
    nullable: false,
  })
  level: number;

  @Column({
    type: 'enum',
    enum: ['ALL', 'ONE', 'MULTI'],
    name: 'selection_rule',
    nullable: true,
  })
  selectionRule: 'ALL' | 'ONE' | 'MULTI' | null;

  @Column({
    type: 'int',
    name: 'min_credits',
    nullable: true,
  })
  minCredits: number | null;

  @Column({
    type: 'int',
    name: 'min_children',
    nullable: true,
  })
  minChildren: number | null;

  @Column({
    type: 'boolean',
    name: 'is_leaf',
    nullable: false,
    default: false,
  })
  isLeaf: boolean;

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

  @ManyToOne(() => MajorEntity, (major) => major.items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'major_id' })
  major: MajorEntity;
}
