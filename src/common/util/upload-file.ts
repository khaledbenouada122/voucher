import * as fs from 'fs';
import { InternalServerErrorException } from '@nestjs/common';
import { parse } from 'csv-parse';

export async function readCsvFromFile(filePath: string, delimiter: string = ','): Promise<any[]> {
  const records: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: delimiter }))
      .on('data', (row) => {
        records.push(row);
      })
      .on('end', () => {
        resolve(records);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

export async function uploadBase64(path: string, file: string): Promise<string> {
  try {
    let extension;
    const extensionType = file.substring(0, 50).toLowerCase();
    if (extensionType.indexOf('png') !== -1) extension = 'png';
    if (extensionType.indexOf('jpg') !== -1) extension = 'jpg';
    if (extensionType.indexOf('jpeg') !== -1) extension = 'jpeg';
    if (extensionType.indexOf('csv') !== -1) extension = 'csv';
    if (extensionType.indexOf('txt') !== -1) extension = 'txt';
    console.log(extension);
    await fs.promises.writeFile(path + '.' + extension, file.split(';base64,').pop(), {
      encoding: 'base64',
    });
    return extension;
  } catch (error) {
    console.error('Error creating file:', error);
    throw new InternalServerErrorException('file not created.', {
      cause: 'upload file csv',
    });
  }
}

export async function deleteFile(path: string) {
  try {
    fs.unlink(path, (err) => {
      if (err) {
        throw new InternalServerErrorException('file not deleted.', {
          cause: 'unlink file csv',
        });
      }
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new InternalServerErrorException('file not deleted.', {
      cause: 'unlink file csv',
    });
  }
}
