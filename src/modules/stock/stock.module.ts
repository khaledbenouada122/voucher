
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';



import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from '../logs/logs.module';

import { StockController } from './stock.controller';
import { StockService } from './stock.service';

import { UploadService } from '../helpers/upload';
import { Stock } from './stock.entity';

@Module({
  imports: [LogsModule, TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [StockService,UploadService],

})
export class StockModule {}
