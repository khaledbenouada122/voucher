/*
https://docs.nestjs.com/providers#services
*/

import {  Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { UploadService } from 'src/modules/helpers/upload';
import { Stock } from './stock.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly uploadServices: UploadService, 
   
  ) {}

  async createStockFromFile(file: Express.Multer.File,productId: any): Promise<any> {
    console.log("file",file);
    console.log("productId",productId);
  
    const findProduct = await Product.findOne({
      where: { id: productId },
  
    });
    console.log("findProduct",findProduct);
    if (!findProduct) {
        return {
            status: false,
            message: "produit n'existe pas ! ",
         
          };

    }
    
    
try {
            const parsedData = await this.uploadServices.uploadFile(file);
            console.log("parsedData",parsedData);
            return
            const uoloadStock = parsedData.results.map((data) => {
            const  newStock = new Stock();
            newStock.code = data.code || ''; 
            newStock.serial = data.serial || '';
            newStock.validityDate = data.validityDate || '';
           
            newStock.productId  = productId;
        
     
  
          //customer.rawPassword = password;
    
          return uoloadStock;
          });
          console.log("customers",uoloadStock)
        
          const savedStock = await this.stockRepository.save(uoloadStock);
          console.log('savedCustomers',savedStock);
       
            return {
            status: true,
            message: 'stock upload successuflly!',
            customers: savedStock,  
          };
        } catch (error) {
          console.log("error",error);
          throw new Error(`Failed to create customers: ${error.message}`);
        }
      }

 
}
