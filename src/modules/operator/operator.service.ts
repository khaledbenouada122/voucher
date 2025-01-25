import { UpdateOperatorDto } from '../../common/dtos/operator/update';
/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operator } from './operator.entity';
import { Repository } from 'typeorm';
import { CreateOperatorDto } from 'src/common/dtos/operator/create';
import { GlobalResponse, GlobalResponseArray } from 'src/common/util/reponse.global';
import { globalMessages } from 'src/common/util/global-messages';
import { LogsService } from '../logs/logs.service';
import { uploadBase64 } from 'src/common/util/upload-file';
import path = require('path');
import { FiltersOperatorDto } from 'src/common/dtos/operator/filtres';
import { filtersClause } from 'src/common/util/paginationFiltre';

@Injectable()
export class OperatorService {
  constructor(
    @Inject(LogsService) private readonly logsService: LogsService,
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>
  ) {}

  async create(ln: string, createOperator: CreateOperatorDto): Promise<GlobalResponse> {
    await this.operatorRepository.update({ label: createOperator.label }, { enabled: false });
    let extension;
    try {
      const filePath = path.join(__dirname, '../../..', '/public/operator/', createOperator.label); // Adjust path as needed
      console.log('filePath', filePath);
      extension = await uploadBase64(filePath, createOperator.image);
    } catch (error) {
      console.log('error', error);
      await this.logsService.create(
        'upload image operator',
        error.message,
        1,
        'api/operator',
        'POST'
      );
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Operator.create.upload error',
        description: error.message,
      });
    }

    try {
      const operator: Operator = this.operatorRepository.create({
        ...createOperator,
        imagePath: '/public/operator/' + createOperator.label + '.' + extension,
      });
      const operatorCreated = await this.operatorRepository.save(operator);
      return new GlobalResponse(operatorCreated, globalMessages[ln].success.add);
    } catch (error) {
      await this.logsService.create('create operator', error.message, 2, 'api/operator', 'POST');
      throw new HttpException(globalMessages[ln].error.server, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: 'Operator.create error',
        description: error.message,
      });
    }
  }
  async getAll(ln: string, filters: FiltersOperatorDto): Promise<GlobalResponseArray> {
    try {
      const validFields = ['label', 'enabled'];
      const clause = await filtersClause(validFields, filters);
      let order = {};
      filters.orderBy
        ? (order = { [filters.orderBy]: filters.sortOrder })
        : (order = { ['createdAt']: 'DESC' });
      const [operators, totalItems] = await this.operatorRepository.findAndCount({
        where: clause,
        order: order,
        take: filters.pageSize,
        skip: (filters.page - 1) * filters.pageSize,
      });
      return new GlobalResponseArray(
        globalMessages[ln].success.list,
        operators,
        operators.length,
        parseInt((totalItems / filters.pageSize + 0.9999).toString())
      );
    } catch (error) {
      console.log('error', error);
      await this.logsService.create('get All operator', error.message, 1, 'api/operator', 'GET');
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Operator.getAll error',
        description: error.message,
      });
    }
  }
  async getOne(ln: string, id: string): Promise<GlobalResponse> {
    try {
      const operator = await this.operatorRepository.findOneBy({ id: id });
      if (!operator) {
        return new GlobalResponse(operator, globalMessages[ln].error.view, false);
      }
      return new GlobalResponse(operator, globalMessages[ln].success.view);
    } catch (error) {
      console.log('error', error);
      await this.logsService.create(
        'get operator by id',
        error.message,
        1,
        'api/operator/:id',
        'GET'
      );
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Operator.getOne error',
        description: error.message,
      });
    }
  }
  async update(
    ln: string,
    id: string,
    updateOperatorDto: UpdateOperatorDto
  ): Promise<GlobalResponse> {
    if (updateOperatorDto.image) {
      try {
        const filePath = path.join(
          __dirname,
          '../../..',
          '/public/operator/',
          updateOperatorDto.label
        ); // Adjust path as needed
        console.log('filePath', filePath);
        const extension = await uploadBase64(filePath, updateOperatorDto.image);
        await this.operatorRepository.update(
          { id: id },
          { imagePath: '/public/operator/' + updateOperatorDto.label + '.' + extension }
        );
      } catch (error) {
        console.log('error', error);
        await this.logsService.create(
          'upload image operator',
          error.message,
          1,
          'api/operator',
          'PUT'
        );
        throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
          cause: 'Operator.create.upload error',
          description: error.message,
        });
      }
    }
    try {
      if (updateOperatorDto.enabled != undefined) {
        const operatorExits = await this.operatorRepository.findOneBy({ id: id });
        await this.operatorRepository.update({ label: operatorExits.label }, { enabled: false });
      }
      delete updateOperatorDto.image;
      await this.operatorRepository.update({ id: id }, updateOperatorDto);
    } catch (error) {
      console.log('error', error);
      await this.logsService.create('update operator', error.message, 1, 'api/operator', 'PUT');
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Operator.update error',
        description: error.message,
      });
    }

    try {
      const operator = await this.operatorRepository.findOneBy({ id: id });
      return new GlobalResponse(operator, globalMessages[ln].success.view);
    } catch (error) {
      console.log('error', error);
      await this.logsService.create(
        'update Operator.getOne',
        error.message,
        1,
        'api/operator',
        'PUT'
      );
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Operator.update.getOne error',
        description: error.message,
      });
    }
  }
}
