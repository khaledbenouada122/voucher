import { Stock } from './../../modules/stock/stock.entity';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Facial } from '../../modules/facial/facial.entity';
import { Logs } from '../../modules/logs/logs.entity';
import { Operator } from '../../modules/operator/operator.entity';
import { Product } from '../../modules/product/product.entity';

import { Voucher } from '../../modules/voucher/voucher.entity';
import { Transaction } from 'src/modules/transaction/transaction.entity';
import { ConfigModule } from '../config/config.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: 'postgresql://khaledbenouada122:Nc39zbZruaUF@ep-rough-tooth-a5ty91lz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
        logging: false,
        entities: [Facial,Product,Operator,Voucher,Transaction,Logs,Stock],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DataBaseModule {}
