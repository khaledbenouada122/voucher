import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { SortOrder } from '../global';
import { LanguageDto } from 'src/common/dtos/language';

export class FiltersProductDto extends LanguageDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: '1',
    required: false,
  })
  productAccountingCode?: string;
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: '....',
    required: false,
    type: 'uuid',
  })
  facialId?: string;
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: '......',
    required: false,
    type: 'uuid',
  })
  operatorId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
    type: 'boolean',
  })
  enabled: boolean;

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
    example: 'DESC|ASC',
    required: false,
  })
  public sortOrder?: SortOrder = SortOrder.DESC;
}
