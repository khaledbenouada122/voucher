/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { GlobalResponseArray } from 'src/common/util/reponse.global';
import { FiltersVoucherDto } from 'src/common/dtos/voucher/filters';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('Voucher')
@Controller('api/voucher')
export class VoucherController {
  constructor(private voucherService: VoucherService) {}
  @MessagePattern({ cmd: 'get-voucher' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getAllTCP(@Payload() filtersDto: FiltersVoucherDto): Promise<GlobalResponseArray> {
    return this.voucherService.getAll(filtersDto.lang, filtersDto);
  }
  
  @Get('')
  @UsePipes(new ValidationPipe())
  getAll(
    @Query() filtersDto: FiltersVoucherDto
  ): Promise<GlobalResponseArray> {
    return this.voucherService.getAll(filtersDto.lang, filtersDto);
  }
}
