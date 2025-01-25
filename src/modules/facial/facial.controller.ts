/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { FacialService } from './facial.service';
import { GlobalResponse, GlobalResponseArray } from 'src/common/util/reponse.global';
import { CreateFacialDto } from 'src/common/dtos/facial/create';
import { UpdateFacialDto, UpdateFacialDtoTcp } from 'src/common/dtos/facial/update';
import { FiltersFacialDto } from 'src/common/dtos/facial/filtres';
import { Request } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HttpExceptionFilter } from 'src/common/exception/excpetion-filtre.exception';
import { PayloadById } from 'src/common/dtos/payload-by-id';

@ApiTags('Facial')
@UseFilters(new HttpExceptionFilter())
@Controller('api/facial')
export class FacialController {
  constructor(private facialService: FacialService) {}

  @MessagePattern({ cmd: 'get-facial' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getAllTCP(@Payload() filtersDto: FiltersFacialDto): Promise<GlobalResponseArray> {
    console.log('filtersDto', filtersDto);
    return this.facialService.getAll(filtersDto.lang, filtersDto);
  }

  @MessagePattern({ cmd: 'get-facial-by-id' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getOneTCP(@Payload() payloadById: PayloadById): Promise<GlobalResponse> {
    return this.facialService.getOne(payloadById.lang, payloadById.id);
  }

  @MessagePattern({ cmd: 'create-facial' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createTCP(@Payload() createFacial: CreateFacialDto): Promise<GlobalResponse> {
    const lang = "fr";
   // delete createFacial.lang;
    return this.facialService.create( createFacial);
  }

  @MessagePattern({ cmd: 'update-facial' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  updateTCP(@Payload() updateFacialDtoTcp: UpdateFacialDtoTcp): Promise<GlobalResponse> {
    return this.facialService.update(
      updateFacialDtoTcp.lang,
      updateFacialDtoTcp.id,
      updateFacialDtoTcp.updateFacialDto
    );
  }

  @Post('')
  @ApiBody({
    type: CreateFacialDto,
    description: 'Json structure for Facial object',
  })
  create(@Body() createFacial: CreateFacialDto): Promise<GlobalResponse> {
    const lang = createFacial.lang;
    delete createFacial.lang;
    return this.facialService.create(createFacial);
  }
  
  @Put('')
  @ApiBody({
    type: UpdateFacialDto,
    description: 'Json structure for Facial object',
  })
  update(
    @Body() updateFacialDto: UpdateFacialDtoTcp
  ): Promise<GlobalResponse> {
    return this.facialService.update(updateFacialDto.lang, updateFacialDto.id, updateFacialDto.updateFacialDto);
  }
  @Get('')
  getAll(
    @Query() filtersDto: FiltersFacialDto
  ): Promise<GlobalResponseArray> {
    const lang = filtersDto.lang;
    delete filtersDto.lang;
    return this.facialService.getAll(lang, filtersDto);
  }

  @Get('/:id')
  getOne(@Req() request: Request, @Param('id', ParseUUIDPipe) id: string): Promise<GlobalResponse> {
    return this.facialService.getOne('fr', id);
  }
}
