import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Index,
} from 'typeorm';
import { IsString } from 'class-validator';
import { Voucher } from '../voucher/voucher.entity';
import { Operator } from '../operator/operator.entity';
import { Facial } from '../facial/facial.entity';

import { Transaction } from '../transaction/transaction.entity';
@Entity({ name: 'products' })
@Index(['operatorId', 'serviceId'])
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  label: string;

  @Column()
  @IsString()
  productAccountingCode: string; // code comptable dans mytools

  @Column({ default: true })
  enabled: boolean;

  @Column({ default: 0 })
  realQuantity: number;

  @Column({ default: 0 })
  virtualQuantity: number;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ nullable: true })
  serviceId: string; // it should be required to update wallet of the client

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

  @OneToMany(() => Voucher, (voucher) => voucher.product)
  vouchers: Array<Voucher>;

  @ManyToOne(() => Operator, (operator) => operator.products, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  operator: Operator;
  @Column()
  operatorId: string;

  @ManyToOne(() => Facial, (facial) => facial.products, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  facial: Facial;
  @Column()
  facialId: string;



  @OneToMany(() => Transaction, (transaction) => transaction.product)
  transactions: Transaction[];
}
