import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { IsDate, IsString } from 'class-validator';
import { Transaction } from '../transaction/transaction.entity';
import { Product } from '../product/product.entity';



@Entity({ name: 'stock' })
export class Stock extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text'})
  @IsString()
  code: string;

  @Column({ unique: true })
  @IsString()
  serial: string;

  @Column()
  @IsDate()
  validityDate: Date;

  @Column({ default: 0 })
  status: number; // 0 non vendu | 1 vendu

  @Column({ nullable: true })
  createdBy: string;

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



 

}
