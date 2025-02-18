import { Controller, Post, Get, Param, Body, ParseIntPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
  async createTransaction(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('voucherId', ParseIntPipe) voucherId: number,
    @Body('amount') amount: number,
  ): Promise<Transaction> {
    return await this.transactionService.createTransaction(userId, voucherId, amount);
  }

  @Get()
  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionService.getTransactions();
  }
}
