/*
https://docs.nestjs.com/modules
*/

import { forwardRef, Module } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { ProductModule } from '../product/product.module';
import { LogsModule } from '../logs/logs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
//import { RabbitmqModule } from 'src/common/config/rabbitMq/rabbitmq.module';
import { VoucherModule } from '../voucher/voucher.module';

@Module({
  imports: [
    LogsModule,
    ProductModule,
   // GatewayModule,
    //forwardRef(() => RabbitmqModule),
    TypeOrmModule.forFeature([Transaction]),
    VoucherModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
