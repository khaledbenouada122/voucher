// src/upload/upload.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser'; // Import csv-parser
import { join } from 'path';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File): Promise<any> {
    const results: any[] = [];
    const filePath = join(__dirname, '../../uploads', file.filename);
    console.log('File path:', filePath); 
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)  
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          resolve({
            message: 'File uploaded and data processed successfully',
            results,
          });
        })
        .on('error', (err) => {
          reject({
            message: 'Error reading or processing the file',
            error: err,
          });
        });
    });
  }
  
}
