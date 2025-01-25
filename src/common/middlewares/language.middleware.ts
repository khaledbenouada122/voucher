/*
https://docs.nestjs.com/middleware#middleware
*/

import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Language, LanguageDto } from '../dtos/language';
import { validate } from 'class-validator';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const lang = req.headers['accept-language']?.toString().toLowerCase() || 'fr';
    console.log('lang', lang);
    if (!Object.values(Language).includes(lang as Language)) {
      throw new HttpException('Invalid language', HttpStatus.BAD_REQUEST, {
        cause: 'header.language error',
        description: 'languageMiddleware',
      });
    }
    const langDto = new LanguageDto(lang as Language);
    const errors = await validate(langDto);
    if (errors.length > 0) {
      throw new HttpException('Invalid language', HttpStatus.BAD_REQUEST);
    }
    req['lang'] = langDto.lang;
    next();
  }
}
