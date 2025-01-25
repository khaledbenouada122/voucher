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
import { ProductService } from './product.service';
import { GlobalResponse, GlobalResponseArray } from 'src/common/util/reponse.global';
import { CreateProductDto } from 'src/common/dtos/product/create';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { FiltersProductDto } from 'src/common/dtos/product/filters';
import { UpdateProductDto, UpdateProductDtoTcp } from 'src/common/dtos/product/update';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PayloadById } from 'src/common/dtos/payload-by-id';

@ApiTags('Product')
@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @MessagePattern({ cmd: 'get-product' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getAllTCP(@Payload() filtersDto: FiltersProductDto): Promise<GlobalResponseArray> {
    return this.productService.getAll(filtersDto.lang, filtersDto);
  }

  @MessagePattern({ cmd: 'get-product-by-id' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getOneTCP(@Payload() payloadById: PayloadById): Promise<GlobalResponse> {
    return this.productService.getOne(payloadById.lang, payloadById.id);
  }

  @MessagePattern({ cmd: 'create-product' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createTCP(@Payload() createProduct: CreateProductDto): Promise<GlobalResponse> {
    const lang = createProduct.lang;
    delete createProduct.lang;
    return this.productService.create(lang, createProduct);
  }

  @MessagePattern({ cmd: 'update-product' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  updateTCP(@Payload() updateProductDtoTcp: UpdateProductDtoTcp): Promise<GlobalResponse> {
    return this.productService.update(
      updateProductDtoTcp.lang,
      updateProductDtoTcp.id,
      updateProductDtoTcp.updateProductDto
    );
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: CreateProductDto,
    description: 'Json structure for Product object',
  })
  create(
    @Body() createProduct: CreateProductDto
  ): Promise<GlobalResponse> {
    const lang ='fr';
    delete createProduct.lang;
    return this.productService.create(lang, createProduct);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  getAll(
    @Query() filtersProductDto: FiltersProductDto
  ): Promise<GlobalResponseArray> {
    return this.productService.getAll(filtersProductDto.lang, filtersProductDto);
  }
  @Get('/:id')
  @UsePipes(new ValidationPipe())
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<GlobalResponse> {
    return this.productService.getOne('fr', id);
  }
  @Put('')
  @UsePipes(new ValidationPipe())
  update(
    @Body() updateProductDto: UpdateProductDtoTcp
  ): Promise<GlobalResponse> {
    return this.productService.update(updateProductDto.lang, updateProductDto.id, updateProductDto.updateProductDto);
  }
}
