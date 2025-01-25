import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { Language } from 'src/common/dtos/language';
import { SortOrder } from '../util/paginationFiltre';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value, 10) || 1)
  @IsNumber({}, { message: ' "page" attribute should be a number' })
  @Min(1, { message: ' "page" attribute should be greater than or equal to 1' })
  @ApiProperty({
    example: 1,
    required: false,
  })
  public page?: number;

  @Transform(({ value }) => parseInt(value, 10) || 10)
  @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
  @Min(1, { message: ' "pageSize" attribute should be greater than or equal to 1' })
  @ApiProperty({
    example: 10,
    required: false,
  })
  public pageSize: number;

  @IsOptional()
  @ApiProperty({
    example: 'createdAt',
    required: false,
  })
  public orderBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  @ApiProperty({
    example: 'DESC|ASC',
    required: false,
  })
  public sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @Transform(({ value }) => value ?? Language.fr)
  @IsEnum(Language)
  @ApiProperty({
    description: 'The language for the request',
    example: 'fr',
    required: false,
    default: 'en',
    enum: ['fr', 'en', 'ar'],
  })
  public lang?: Language = Language.en;
}
