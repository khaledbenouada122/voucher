/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './voucher.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateVoucherDto } from 'src/common/dtos/voucher/create';
import { LogsService } from '../logs/logs.service';

import { FiltersVoucherDto } from 'src/common/dtos/voucher/filters';
import { GlobalResponseArray } from 'src/common/util/reponse.global';
import { filtersClause } from 'src/common/util/paginationFiltre';
import { globalMessages } from 'src/common/util/global-messages';
import { SellVoucherDto } from 'src/common/dtos/voucher/sell';

@Injectable()
export class VoucherService {
  constructor(
    @Inject(LogsService) private readonly logsService: LogsService,
 
    @InjectRepository(Voucher) private readonly voucherRepository: Repository<Voucher>
  ) {}

  async create(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    try {
      const createdVoucher = this.voucherRepository.create(createVoucherDto);
      return await this.voucherRepository.save(createdVoucher);
    } catch (error) {
      if (error.code === '23505') {
      
        throw new Error('voucher already exists');
      }
     
      throw error;
    }
  }

  async getAll(ln: string, filters: FiltersVoucherDto): Promise<GlobalResponseArray> {
    try {
      const validFields = ['transactionId', 'documentId', 'productId', 'status'];
      const clause = await filtersClause(validFields, filters);
      let order = {};
      filters.orderBy
        ? (order = { [filters.orderBy]: filters.sortOrder })
        : (order = { ['createdAt']: 'DESC' });
      const [vouchers, totalItems] = await this.voucherRepository.findAndCount({
        where: clause,
        order: order,
        take: filters.pageSize,
        skip: (filters.page - 1) * filters.pageSize,
        relations: ['transaction', 'document', 'product'],
      });
      return new GlobalResponseArray(
        globalMessages[ln].success.list,
        vouchers,
        vouchers.length,
        parseInt((totalItems / filters.pageSize + 0.9999).toString())
      );
    } catch (error) {
      console.log('error', error);
      await this.logsService.create('Get all voucher', error.message, 1, 'api/voucher', 'GET');
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Voucher.getAll error',
        description: error.message,
      });
    }
  }

  async sellVoucher(sellVoucherDto: SellVoucherDto): Promise<UpdateResult> {
    try {
      const vouchersToUpdate = await this.voucherRepository
        .createQueryBuilder('voucher')
        .select('voucher.id')
        .where('voucher.status = :status', { status: 0 })
        .orderBy('voucher.createdAt', 'ASC')
        .limit(sellVoucherDto.quantity)
        .getMany();

      const voucherIds = vouchersToUpdate.map((v) => v.id);
      console.log('voucherIds', voucherIds);
      // Update records
      const result = await this.voucherRepository
        .createQueryBuilder()
        .update()
        .set({
          transactionId: sellVoucherDto.transactionId,
          status: 1,
        })
        .whereInIds(voucherIds)
        .execute();
      console.log(result);
      return result; // Return the number of affected rows
    } catch (error) {
      await this.logsService.create('sell voucher', error.message, 1, 'sellVoucher', 'POST');
      throw new HttpException(globalMessages['fr'].error.server, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: 'Voucher.sellVoucher error',
        description: error.message,
      });
    }
  }

  async rollbackSellVoucher(transactionId: string): Promise<UpdateResult> {
    try {
      const result = await this.voucherRepository
        .createQueryBuilder()
        .update()
        .set({
          transactionId: null,
          status: 0,
        })
        .where({
          transactionId: transactionId,
        })
        .execute();
      console.log(result);
      return result; // Return the number of affected rows
    } catch (error) {
      await this.logsService.create('sell voucher', error.message, 1, 'sellVoucher', 'POST');
      throw new HttpException(globalMessages['fr'].error.server, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: 'Voucher.sellVoucher error',
        description: error.message,
      });
    }
  }
}
