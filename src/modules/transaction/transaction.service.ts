/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { GlobalResponse, GlobalResponseArray } from 'src/common/util/reponse.global';
import { globalMessages } from 'src/common/util/global-messages';
import { filtersClause } from 'src/common/util/paginationFiltre';
import { FiltersTransactionDto } from 'src/common/dtos/transaction/filters';
import { ProductService } from '../product/product.service';
import { CreateTransactionDto } from 'src/common/dtos/transaction/create';
//import { ProducerService } from 'src/common/config/rabbitMq/producer.service';
import { VoucherService } from '../voucher/voucher.service';


@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(ProductService) private readonly productService: ProductService,
   // @Inject(ProducerService) private readonly producerService: ProducerService,
    @Inject(VoucherService) private readonly voucherService: VoucherService,
   
    @Inject(LogsService) private readonly logsService: LogsService
  ) {}

  async order(ln: string, createTransaction: CreateTransactionDto): Promise<GlobalResponse> {
    const product: GlobalResponse = await this.productService.getOne(
      ln,
      createTransaction.productId
    );
    if (!product.status) {
     { 
      /* await this.gatewayService.rollBackSolde({
        id:createTransaction.statementId,
        updatedBy: createTransaction.customerId
      })*/}
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Transaction.order product not found',
        description: 'product dos not exist',
      });
  
    }

    if (
      product.data.virtualQuantity < 10 ||
      product.data.virtualQuantity < 10 + createTransaction.quantity
    ) {
      console.log("here 1 ")
   { /*  await this.gatewayService.rollBackSolde({
        id:createTransaction.statementId,
        updatedBy: createTransaction.customerId
      })*/}
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Transaction.order stock insufisants',
        description: 'stock insufisants',
      });
    }

    try {
      await this.productService.update('fr', createTransaction.productId, {
        virtualQuantity: product.data.virtualQuantity - createTransaction.quantity,
      });
      const transaction = this.transactionRepository.create(createTransaction);
      const TransactionCreated: Transaction = await this.transactionRepository.save(transaction);
    {/*  this.producerService.addToQueue(
        product.data.label.replace(/\s+/g, '') + '-' + product.data.id,
        TransactionCreated
      );*/}
      return new GlobalResponse(TransactionCreated, globalMessages[ln].success.orderVoucher);
    } catch (error) {
      await this.logsService.create(
        'order Transaction',
        error.message,
        2,
        'api/transaction/order',
        'POST'
      );
   
      throw new HttpException(globalMessages[ln].error.server, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: 'Transaction.order error',
        description: error.message,
      });
    }
  }

  async validateOrder(transaction: Transaction) {
    try {
      await this.voucherService.sellVoucher({
        productId: transaction.productId,
        quantity: transaction.quantity,
        transactionId: transaction.id,
      });
      await this.transactionRepository.update({ id: transaction.id }, { status: 1 });
    } catch (error) {
      await this.logsService.create(
        'validate order Transaction',
        error.message,
        2,
        'api/transaction/order/valdiate',
        'POST'
      );
      await this.voucherService.rollbackSellVoucher(transaction.id);
      await this.transactionRepository.update({ id: transaction.id }, { status: 2 });

      // this.producerService.addToQueue('rollback-balance', {
      //   transaction: transaction.id,
      // });
    }
  }
  async getAll(ln: string, filters: FiltersTransactionDto): Promise<GlobalResponseArray> {
    try {
      const validFields = ['ref', 'customerAccountingCode', 'productId', 'fullName', 'source'];
      const clause = await filtersClause(validFields, filters);
      let order = {};
      filters.orderBy
        ? (order = { [filters.orderBy]: filters.sortOrder })
        : (order = { ['createdAt']: 'DESC' });
      const [transactions, totalItems] = await this.transactionRepository.findAndCount({
        where: clause,
        order: order,
        take: filters.pageSize,
        skip: (filters.page - 1) * filters.pageSize,
        relations: ['vouchers'],
      });
      return new GlobalResponseArray(
        globalMessages[ln].success.list,
        transactions,
        transactions.length,
        parseInt((totalItems / filters.pageSize + 0.9999).toString())
      );
    } catch (error) {
      console.log('error', error);
      await this.logsService.create(
        'get All Transaction',
        error.message,
        1,
        'api/Transaction',
        'GET'
      );
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Transaction.getAll error',
        description: error.message,
      });
    }
  }
}
