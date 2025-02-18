

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn } from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { IsDate, IsString } from 'class-validator';


@Entity()
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  @IsString()
  code: string;
  @Column({ unique: true })
  @IsString()
  serial: string;

  @Column()
  @IsDate()
  validityDate: Date;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;
  @Column({ default: 0 })
  status: number; // 0 non vendu | 1 vendu

  @Column({ default: false })
  used: boolean; 
  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  deletedBy: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => Transaction, (transaction) => transaction.voucher)
  transaction: Transaction;
}
