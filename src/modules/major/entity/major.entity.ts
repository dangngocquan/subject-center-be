import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MajorItemEntity } from './major-item.entity';

@Entity({ name: 'major' })
export class MajorEntity {
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

  @OneToMany(() => MajorItemEntity, (item) => item.major)
  items: MajorItemEntity[];
}
