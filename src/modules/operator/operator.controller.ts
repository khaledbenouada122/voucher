import { Payload, MessagePattern } from '@nestjs/microservices';
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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OperatorService } from './operator.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GlobalResponse, GlobalResponseArray } from 'src/common/util/reponse.global';
import { UpdateOperatorDto, UpdateOperatorDtoTcp } from 'src/common/dtos/operator/update';
import { FiltersOperatorDto } from 'src/common/dtos/operator/filtres';
import { CreateOperatorDto } from 'src/common/dtos/operator/create';
import { Request } from 'express';
import { PayloadById } from 'src/common/dtos/payload-by-id';

@ApiTags('Operator')
@Controller('api/operator')
export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  @MessagePattern({ cmd: 'get-operator' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getAllTCP(@Payload() filtersDto: FiltersOperatorDto): Promise<GlobalResponseArray> {
    return this.operatorService.getAll(filtersDto.lang, filtersDto);
  }

  @MessagePattern({ cmd: 'get-operator-by-id' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getOneTCP(@Payload() payloadById: PayloadById): Promise<GlobalResponse> {
    return this.operatorService.getOne(payloadById.lang, payloadById.id);
  }

  @MessagePattern({ cmd: 'create-operator' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createTCP(@Payload() createOperator: CreateOperatorDto): Promise<GlobalResponse> {
    const lang = createOperator.lang;
    delete createOperator.lang;
    return this.operatorService.create(lang, createOperator);
  }

  @MessagePattern({ cmd: 'update-operator' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  updateTCP(@Payload() updateOperatorDtoTcp: UpdateOperatorDtoTcp): Promise<GlobalResponse> {
    return this.operatorService.update(
      updateOperatorDtoTcp.lang,
      updateOperatorDtoTcp.id,
      updateOperatorDtoTcp.updateOperatorDto
    );
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: CreateOperatorDto,
    description: 'Json structure for operator object',
  })
  create(
    @Req() request: Request,
    @Body() createOperator: CreateOperatorDto
  ): Promise<GlobalResponse> {
    return this.operatorService.create(request['lang'], createOperator);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: UpdateOperatorDto,
    description: 'Json structure for operator object',
  })
  update(
    @Req() request: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOperatorDto: UpdateOperatorDto
  ): Promise<GlobalResponse> {
    return this.operatorService.update(request['lang'], id, updateOperatorDto);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  getAll(
    @Req() request: Request,
    @Query() filtersDto: FiltersOperatorDto
  ): Promise<GlobalResponseArray> {
    return this.operatorService.getAll(request['lang'], filtersDto);
  }

  @Get('/:id')
  @UsePipes(new ValidationPipe())
  getOne(@Req() request: Request, @Param('id', ParseUUIDPipe) id: string): Promise<GlobalResponse> {
    return this.operatorService.getOne(request['lang'], id);
  }
}
