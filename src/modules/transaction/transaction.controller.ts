/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GlobalResponse, GlobalResponseArray } from 'src/common/util/reponse.global';
import { FiltersTransactionDto } from 'src/common/dtos/transaction/filters';
import { CreateTransactionDto } from 'src/common/dtos/transaction/create';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('Transaction')
@Controller('api/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @MessagePattern({ cmd: 'get-transaction' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getAllTCP(@Payload() filtersDto: FiltersTransactionDto): Promise<GlobalResponseArray> {
    return this.transactionService.getAll(filtersDto.lang, filtersDto);
  }

  @MessagePattern({ cmd: 'order' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createTCP(@Payload() createTransaction: CreateTransactionDto): Promise<GlobalResponse> {
    const lang = createTransaction.lang;
    delete createTransaction.lang;
    return this.transactionService.order(lang, createTransaction);
  }


  @Post('/order')
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Json structure for Transaction object',
  })
  order(
    @Body() createTransaction: CreateTransactionDto
  ): Promise<GlobalResponse> {
    const lang = createTransaction.lang;
    delete createTransaction.lang;
    return this.transactionService.order(lang, createTransaction);
  }
  @Get('')
  getAll(
    @Query() filtersTransactionDto: FiltersTransactionDto
  ): Promise<GlobalResponseArray> {
    return this.transactionService.getAll(filtersTransactionDto.lang, filtersTransactionDto);
  }
}
