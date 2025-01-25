import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { PaginationDto } from '../pagination';

export class FiltersFacialDto extends PaginationDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: '5 TND',
    required: false,
  })
  label?: string;
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(1.09)
  @ApiProperty({
    example: '1.7',
    required: false,
    type: 'number',
  })
  value?: number;
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
    type: 'boolean',
  })
  enabled?: boolean;
}
