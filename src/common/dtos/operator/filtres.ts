import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { SortOrder } from '../global';
import { LanguageDto } from 'src/common/dtos/language';
import { PaginationDto } from '../pagination';

export class FiltersOperatorDto extends PaginationDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: 'OOREDOO',
    required: false,
  })
  label: string;
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
    type: 'boolean',
  })
  enabled: boolean;
}
