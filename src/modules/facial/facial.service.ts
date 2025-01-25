/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FiltersFacialDto } from 'src/common/dtos/facial/filtres';
import { UpdateFacialDto } from 'src/common/dtos/facial/update';
import { globalMessages } from 'src/common/util/global-messages';
import { GlobalResponse, GlobalResponseArray } from 'src/common/util/reponse.global';
import { Facial } from './facial.entity';
import { CreateFacialDto } from 'src/common/dtos/facial/create';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { filtersClause } from 'src/common/util/paginationFiltre';

@Injectable()
export class FacialService {
  constructor(
    @Inject(LogsService) private readonly logsService: LogsService,
    @InjectRepository(Facial)
    private facialRepository: Repository<Facial>
  ) {}

  async create( createFacial: CreateFacialDto): Promise<GlobalResponse> {
    await this.facialRepository.update({ label: createFacial.label }, { enabled: false });

    try {
      const Facial: Facial = this.facialRepository.create(createFacial);
      const FacialCreated = await this.facialRepository.save(Facial);
      return new GlobalResponse(FacialCreated, "creation Facial avec Succées");
    } catch (error) {
      await this.logsService.create('create Facial', error.message, 2, 'api/facial', 'POST');
      throw new HttpException(globalMessages['fr'].error.server, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: 'Facial.create error',
        description: error.message,
      });
    }
  }
  async getAll(ln: string, filters: FiltersFacialDto): Promise<GlobalResponseArray> {
    try {
      const validFields = ['label', 'enabled', 'value'];
      const clause = await filtersClause(validFields, filters);

      let order = {};
      filters.orderBy
        ? (order = { [filters.orderBy]: filters.sortOrder })
        : (order = { ['createdAt']: 'DESC' });
      const [facials, totalItems] = await this.facialRepository.findAndCount({
        where: clause,
        order: order,
        take: filters.pageSize,
        skip: (filters.page - 1) * filters.pageSize,
      });
      return new GlobalResponseArray(
        globalMessages[ln].success.list,
        facials,
        facials.length,
        parseInt((totalItems / filters.pageSize + 0.9999).toString())
      );
    } catch (error) {
      console.log('error', error);
      await this.logsService.create('get All Facial', error.message, 1, 'api/facial', 'GET');
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Facial.getAll error',
        description: error.message,
      });
    }
  }
  async getOne(ln: string, id: string): Promise<GlobalResponse> {
    try {
      const facial = await this.facialRepository.findOneBy({ id: id });
      if (!facial) {
        return new GlobalResponse(facial, globalMessages[ln].error.view, false);
      }
      return new GlobalResponse(facial, globalMessages[ln].success.view);
    } catch (error) {
      console.log('error', error);
      await this.logsService.create('get Facial by id', error.message, 1, 'api/facial/:id', 'GET');
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Facial.getOne error',
        description: error.message,
      });
    }
  }
  async update(ln: string, id: string, updateFacialDto: UpdateFacialDto): Promise<GlobalResponse> {
    try {
      if (updateFacialDto.enabled != undefined) {
        const FacialExits = await this.facialRepository.findOneBy({ id: id });
        await this.facialRepository.update({ label: FacialExits.label }, { enabled: false });
      }
      await this.facialRepository.update({ id: id }, updateFacialDto);
    } catch (error) {
      console.log('error', error);
      await this.logsService.create('update Facial', error.message, 1, 'api/facial', 'PUT');
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Facial.update error',
        description: error.message,
      });
    }
    try {
      const Facial = await this.facialRepository.findOneBy({ id: id });
      return new GlobalResponse(Facial, globalMessages[ln].success.view);
    } catch (error) {
      console.log('error', error);
      await this.logsService.create('update Facial.getOne', error.message, 1, 'api/facial', 'PUT');
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Facial.update.getOne error',
        description: error.message,
      });
    }
  }
}
