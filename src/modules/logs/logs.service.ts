/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from './logs.entity';
import { Repository } from 'typeorm';
import { GlobalResponseArray } from 'src/common/util/reponse.global';
import { globalMessages } from 'src/common/util/global-messages';
import { FiltersLogsDto } from 'src/common/dtos/logs/filters';

@Injectable()
export class LogsService {
  constructor(@InjectRepository(Logs) private readonly logsRepository: Repository<Logs>) {}

  async getAll(ln: string, filtersLogsDto: FiltersLogsDto): Promise<GlobalResponseArray> {
    try {
      let order = {};
      filtersLogsDto.orderBy
        ? (order = { [filtersLogsDto.orderBy]: filtersLogsDto.sortOrder })
        : (order = { ['createdAt']: 'DESC' });
      const [logs, totalItems] = await this.logsRepository.findAndCount({
        order: order,
        take: filtersLogsDto.pageSize,
        skip: (filtersLogsDto.page - 1) * filtersLogsDto.pageSize,
      });
      return new GlobalResponseArray(
        globalMessages[ln].success.list,
        logs,
        logs.length,
        parseInt((totalItems / filtersLogsDto.pageSize + 0.9999).toString())
      );
    } catch (error) {
      throw new HttpException(globalMessages[ln].error.server, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async create(
    cause: string,
    detail: string,
    level: number,
    path: string,
    methode: string,
    relatedId?: string,
    userId?: string
  ): Promise<Logs> {
    try {
      const logs = await this.logsRepository.save({
        cause: cause,
        detail: detail,
        level: level,
        path: path,
        relatedId: relatedId,
        methode: methode,
        userId: userId,
      });
      return logs;
    } catch (error) {
      console.log('error', error);
      throw new HttpException(globalMessages['fr'].error.server, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
