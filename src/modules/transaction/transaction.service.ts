import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Voucher } from '../voucher/voucher.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,


  ) {}

  private async findAndLockVoucher(voucherId: number, transactionalEntityManager): Promise<Voucher> {
    return await transactionalEntityManager
      .getRepository(Voucher)
      .createQueryBuilder('voucher')
      .setLock('pessimistic_write')
      .where('voucher.id = :id', { id: voucherId })
      .andWhere('voucher.used = false')
      .getOne();
  }

  private async checkExistingTransaction(voucherId: number, transactionalEntityManager): Promise<boolean> {
    return !!(await transactionalEntityManager
      .getRepository(Transaction)
      .findOne({ where: { voucher: { id: voucherId } } }));
  }

  async createTransaction(userId: number, voucherId: number, amount: number): Promise<Transaction> {
    return await this.transactionRepository.manager.transaction(async (transactionalEntityManager) => {
      const voucher = await this.findAndLockVoucher(voucherId, transactionalEntityManager);
      if (!voucher) throw new NotFoundException('Voucher not found or already used');

      if (await this.checkExistingTransaction(voucherId, transactionalEntityManager)) {
        throw new ConflictException('Voucher already redeemed');
      }

      voucher.used = true;
      await transactionalEntityManager.save(voucher);

      const transaction = this.transactionRepository.create({
        userId,
        voucher,
        amount,
      });

      return await transactionalEntityManager.save(transaction);
    });
  }

  async getTransactions(): Promise<Transaction[]> {
    return await this.transactionRepository.find({ relations: ['voucher'] });
  }
}
