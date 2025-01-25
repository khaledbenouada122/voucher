import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { Voucher } from '../voucher/voucher.entity';
import { Product } from '../product/product.entity';

@Entity({ name: 'transactions' })
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  ref: string; // code comptable dans mytools

  @Column()
  customerId: string; // id client dans khallasli

  @Column()
  customerAccountingCode: string; // code comptable du client dans mytools

  @Column()
  fullName: string; // full name client

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  status: number; // 0 en cours | 1 succés | 2 echec

  @Column({ default: 'Mobile' })
  source: string; // source='Mobile' | Web | 'Tpe'

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

  @OneToMany(() => Voucher, (voucher) => voucher.transaction)
  vouchers: Array<Voucher>;

  @ManyToOne(() => Product, (product) => product.transactions)
  product: Product;

  @Column()
  productId: string;

  @Column({unique: true })
  statementId: string;

  @BeforeInsert()
  async generateRef() {
    try {
      const lastRecord = await Transaction.find({
        order: { ref: 'DESC' },
        select: ['ref'],
      });

      let newRef = 'TR00001'; // Default starting value

      if (lastRecord && lastRecord[0]?.ref) {
        const lastRefNumber = parseInt(lastRecord[0].ref.replace('TR', ''), 10);
        const nextRefNumber = lastRefNumber + 1;
        newRef = `TR${String(nextRefNumber).padStart(5, '0')}`;
      }

      this.ref = newRef;
      console.log('Generated ref:', this.ref); // Debugging output
    } catch (err) {
      console.log('Error generating ref:', err);
      throw new Error('Failed to generate transaction reference');
    }
  }
}
