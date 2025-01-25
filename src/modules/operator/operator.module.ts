import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatorService } from './operator.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Operator } from './operator.entity';
import { LogsModule } from '../logs/logs.module';
import { OperatorController } from './operator.controller';

@Module({
  imports: [LogsModule, TypeOrmModule.forFeature([Operator])],
  controllers: [OperatorController],
  providers: [OperatorService],
  exports: [OperatorService],
})
export class OperatorModule {}
