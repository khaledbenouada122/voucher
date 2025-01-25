/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { GlobalResponseArray } from 'src/common/util/reponse.global';
import { FiltersLogsDto } from 'src/common/dtos/logs/filters';
import { Request } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('Logs')
@Controller('api/logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @MessagePattern({ cmd: 'get-logs' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getAllTCP(@Payload() filtersLogsDto: FiltersLogsDto): Promise<GlobalResponseArray> {
    return this.logsService.getAll(filtersLogsDto.lang, filtersLogsDto);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  get(
    @Query() filtersLogsDto: FiltersLogsDto
  ): Promise<GlobalResponseArray> {
    
    return this.logsService.getAll(filtersLogsDto.lang, filtersLogsDto);
  }
}
