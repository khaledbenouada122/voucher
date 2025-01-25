import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SortOrder } from '../global';
import { LanguageDto } from 'src/common/dtos/language';

export class FiltersTransactionDto extends LanguageDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '',
    required: false,
    type: 'string',
  })
  ref: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '',
    required: false,
    type: 'string',
  })
  customerAccountingCode: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '',
    required: false,
    type: 'uuid',
  })
  productId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '',
    required: false,
    type: 'string',
  })
  fullName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '',
    required: false,
    type: 'string',
  })
  source: string;

  @Transform(({ value }) => parseInt(value, 10) || 1)
  @IsNumber({}, { message: ' "page" atrribute should be a number' })
  @Min(1, { message: ' "page" attribute should be greater than or equal to 1' })
  @ApiProperty({
    example: 1,
    required: false,
  })
  public page: number;

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
    example: 'DESC',
    required: false,
  })
  public sortOrder?: SortOrder = SortOrder.DESC;
}
