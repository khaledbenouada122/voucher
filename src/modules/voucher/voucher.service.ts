import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from './voucher.entity';
import { Transaction } from '../transaction/transaction.entity';


@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async purchaseVoucher(userId: number, voucherId: number, amount: number): Promise<string> {
    return await this.voucherRepository.manager.transaction(async (transactionalEntityManager) => {
      // Step 1: Lock the voucher to prevent concurrent access
      const voucher = await transactionalEntityManager
        .getRepository(Voucher)
        .createQueryBuilder('voucher')
        .setLock('pessimistic_write') // 🚀 Equivalent to "SELECT ... FOR UPDATE"
        .where('voucher.id = :id', { id: voucherId })
        .andWhere('voucher.used = false')
        .getOne();

      if (!voucher) {
        throw new NotFoundException('Voucher not found or already used');
      }

      // Step 2: Ensure voucher isn't already used in transactions (redundant check)
      const existingTransaction = await transactionalEntityManager
        .getRepository(Transaction)
        .findOne({ where: { voucher: { id: voucherId } } });

      if (existingTransaction) {
        throw new ConflictException('Voucher already redeemed');
      }

      // Step 3: Mark the voucher as used
      voucher.used = true;
      await transactionalEntityManager.save(voucher);

      // Step 4: Insert transaction record
      const transaction = new Transaction();
      transaction.userId = userId;
      transaction.voucher = voucher;
      transaction.amount = amount;
      await transactionalEntityManager.save(transaction);

      return 'Voucher redeemed successfully!';
    });
  }
}
