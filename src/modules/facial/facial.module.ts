import { TypeOrmModule } from '@nestjs/typeorm';
import { FacialController } from './facial.controller';
import { Facial } from './facial.entity';
import { FacialService } from './facial.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [LogsModule, TypeOrmModule.forFeature([Facial])],
  controllers: [FacialController],
  providers: [FacialService],
  exports: [FacialService],
})
export class FacialModule {}
