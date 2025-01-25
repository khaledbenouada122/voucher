import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { IsString } from 'class-validator';
import { Product } from '../product/product.entity';
@Entity({ name: 'facials' })
@Index(['label', 'value'])
export class Facial extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  label: string;

  @Column({ type: 'float' })
  value: number;

  @Column({ default: true })
  enabled: boolean;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  createdByFullName: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  deletedBy: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.facial)
  products: Array<Product>;
}
