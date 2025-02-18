import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Voucher } from '../voucher/voucher.entity';


@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => Voucher, (voucher) => voucher.transaction, { eager: true })
  voucher: Voucher;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
