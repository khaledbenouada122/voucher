/*
https://docs.nestjs.com/providers#services
*/

import { LogsService } from '../logs/logs.service';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { globalMessages } from 'src/common/util/global-messages';
import { GlobalResponse, GlobalResponseArray } from 'src/common/util/reponse.global';
import { CreateProductDto } from 'src/common/dtos/product/create';
import { deleteFile, uploadBase64 } from 'src/common/util/upload-file';
import { FacialService } from '../facial/facial.service';
import { OperatorService } from '../operator/operator.service';
import { FiltersProductDto } from 'src/common/dtos/product/filters';
import { filtersClause } from 'src/common/util/paginationFiltre';
import { UpdateProductDto } from 'src/common/dtos/product/update';
import path = require('path');

@Injectable()
export class ProductService {
  constructor(
    @Inject(LogsService) private readonly logsService: LogsService,
    @Inject(FacialService) private readonly facialService: FacialService,
    @Inject(OperatorService) private readonly operatorService: OperatorService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(ln: string, createProduct: CreateProductDto): Promise<GlobalResponse> {
    const facial: GlobalResponse = await this.facialService.getOne('fr', createProduct.facialId);
    if (!facial.status) {
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Product.create warning',
        description: 'facialId dos not exist',
      });
    }
    const operator: GlobalResponse = await this.operatorService.getOne(
      'fr',
      createProduct.operatorId
    );
    if (!operator.status) {
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Product.create warning',
        description: 'facialId dos not exist',
      });
    }
    await this.productRepository.update(
      { facialId: createProduct.facialId, operatorId: createProduct.operatorId },
      { enabled: false }
    );
  
    let extension;
    try {
 
      let product: Product;
      if (createProduct.image) {
        product = this.productRepository.create({
          ...createProduct,
          imagePath: '/public/operator/' + createProduct.label + '.' + extension,
        });
      } else {
        product = this.productRepository.create(createProduct);
      }
      const ProductCreated: Product = await this.productRepository.save(product);
      console.log("ProductCreated",ProductCreated);
      return new GlobalResponse(ProductCreated, globalMessages['fr'].success.add);
    } catch (error) {
      await this.logsService.create('create Product', error.message, 2, 'api/Product', 'POST');
      throw new HttpException(globalMessages['fr'].error.server, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: 'Product.create error',
        description: error.message,
      });
    }
  }
  async getAll(ln: string, filters: FiltersProductDto): Promise<GlobalResponseArray> {  
    try {
      const validFields = ['productAccountingCode', 'facialId', 'operatorId'];
      const clause = await filtersClause(validFields, filters);
      let order = {};
      filters.orderBy
        ? (order = { [filters.orderBy]: filters.sortOrder })
        : (order = { ['createdAt']: 'DESC' });
      const [Products, totalItems] = await this.productRepository.findAndCount({
        where: clause,
        order: order,
        take: filters.pageSize,
        skip: (filters.page - 1) * filters.pageSize,
      });
      return new GlobalResponseArray(
        globalMessages[ln].success.list,
        Products,
        Products.length,
        parseInt((totalItems / filters.pageSize + 0.9999).toString())
      );
    } catch (error) {
      console.log('error', error);
      await this.logsService.create('get All Product', error.message, 1, 'api/Product', 'GET');
      throw new HttpException(globalMessages['fr'].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Product.getAll error',
        description: error.message,
      });
    }
  }
  async getOne(ln: string, id: string): Promise<GlobalResponse> {
    try {
      const product = await this.productRepository.findOneBy({ id: id });
      if (!product) {
        throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
          cause: 'Product.getOne by id warning',
          description: 'product not found',
        });
      }
      return new GlobalResponse(product, globalMessages[ln].success.view);
    } catch (error) {
      console.log('error', error);
      await this.logsService.create(
        'get Product by id',
        error.message,
        1,
        'api/product/:id',
        'GET'
      );
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Product.getOne error',
        description: error.message,
      });
    }
  }
  async update(
    ln: string,
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<GlobalResponse> {
    try {
      const ProductExits = await this.productRepository.findOneBy({ id: id });
      if (updateProductDto.enabled != undefined && updateProductDto.enabled == true) {
        await this.productRepository.update({ label: ProductExits.label }, { enabled: false });
      }
      if (updateProductDto.image) {
        try {
          await deleteFile(ProductExits.imagePath);
          const filePath = path.join(
            __dirname,
            '../../..',
            '/public/product/',
            updateProductDto.label
          );
          const extension: string = await uploadBase64(filePath, updateProductDto.image);
          delete updateProductDto.image;
          await this.productRepository.update(
            { id: id },
            {
              ...updateProductDto,
              imagePath: '/public/product/' + ProductExits.label + '.' + extension,
            }
          );
        } catch (err) {
          await this.logsService.create(
            'upload image product',
            err.message,
            1,
            'api/product/' + id,
            'PUT'
          );
          throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
            cause: 'product.update.upload error',
            description: err.message,
          });
        }
      } else {
        await this.productRepository.update({ id: id }, updateProductDto);
      }
    } catch (error) {
      console.log('error', error);
      await this.logsService.create('update Product', error.message, 1, 'api/Product', 'PUT');
      throw new HttpException(globalMessages[ln].error.invalidParams, HttpStatus.BAD_REQUEST, {
        cause: 'Product.update error',
        description: error.message,
      });
    }
    return new GlobalResponse((await this.getOne(ln, id)).data, globalMessages[ln].success.edit);
  }
}
