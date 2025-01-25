/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

import { Product } from './product.entity';
import { FacialModule } from '../facial/facial.module';
import { OperatorModule } from '../operator/operator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from '../logs/logs.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { UploadService } from '../helpers/upload';

@Module({
  imports: [LogsModule, FacialModule, OperatorModule, TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
