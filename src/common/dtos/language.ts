import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export enum Language {
  ar = 'ar',
  en = 'en',
  fr = 'fr',
}

export class LanguageDto {
  constructor(lang: Language) {
    console.log('lang', lang);
    this.lang = lang;
  }
  @IsEnum(Language)
  @IsOptional()
  @Transform(({ value }) => value ?? Language.en)
  @ApiProperty({
    description: 'The language for the request',
    example: 'fr', // Example value
    required: false, // Mark the field as optional
    default: 'en', // Default value for Swagger documentation
    enum: ['fr', 'en', 'ar'], // Available enum options
  })
  lang?: Language = Language.en;
}
