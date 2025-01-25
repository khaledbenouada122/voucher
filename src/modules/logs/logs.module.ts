import { LogsController } from './logs.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Logs } from './logs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsService } from './logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Logs])],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
