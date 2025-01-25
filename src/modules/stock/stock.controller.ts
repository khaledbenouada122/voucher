  import { Body, Controller, Get, Post, Query, Req, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiBody, ApiConsumes } from '@nestjs/swagger';
  import { StockService } from './stock.service';

  import { GlobalResponse } from 'src/common/util/reponse.global';
import { storageConfig } from 'src/util/storageConfig';



  @Controller('stock')
  export class StockController {
    constructor(private readonly stockService: StockService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storageConfig)) 
    
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'Upload CSV file to create customers',
      schema: {
        type: 'object',
        properties: {
          file: { type: 'string', format: 'binary' },
        },
      },
    })
    
    async uploadFile(@UploadedFile() file: Express.Multer.File,  @Body('productId') productId: string,): Promise<GlobalResponse> {
      
 
      return await this.stockService.createStockFromFile(file,productId);
    }
  
      
  }

