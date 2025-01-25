import { Product } from 'src/modules/product/product.entity';
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
@Entity({ name: 'operators' })
@Index(['label'])
export class Operator extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  label: string;

  @Column()
  @IsString()
  description: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ nullable: false })
  imagePath: string;

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

  @OneToMany(() => Product, (product) => product.operator)
  products: Array<Product>;
}
