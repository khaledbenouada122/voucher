import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { PayloadById } from '../payload-by-id';

export class UpdateProductDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'OOREDOO 5TND',
    required: true,
  })
  label?: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1',
    required: true,
  })
  productAccountingCode?: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1',
    required: true,
    type: 'uuid',
  })
  facialId?: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1',
    required: true,
    type: 'uuid',
  })
  operatorId?: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '...........',
    required: true,
    type: 'uuid',
  })
  serviceId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
    type: 'boolean',
  })
  enabled?: boolean;

  @IsOptional()
  @ApiProperty({
    example: true,
    required: false,
    type: 'number',
  })
  realQuantity?: number;

  @IsOptional()
  @ApiProperty({
    example: true,
    required: false,
    type: 'number',
  })
  virtualQuantity?: number;
  @IsOptional()
  @IsNotEmpty()
  @Matches(/^data:image\/(png|jpeg);base64,/, { message: 'Invalid image format' })
  @ApiProperty({
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3',
    required: false,
  })
  image?: string;
}

export class UpdateProductDtoTcp extends PayloadById {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateProductDto)
  @ApiProperty({
    required: true,
    type: UpdateProductDto,
   
  })
  updateProductDto: UpdateProductDto;
}

