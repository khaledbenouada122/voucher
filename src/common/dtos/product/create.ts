import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { LanguageDto } from '../language';

export class CreateProductDto extends LanguageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'OOREDOO 5TND',
    required: true,
  })
  label: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '1',
    required: true,
  })
  productAccountingCode: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1',
    required: true,
    type: 'uuid',
  })
  facialId: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1',
    required: true,
    type: 'uuid',
  })
  operatorId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '...........',
    required: true,
    type: 'uuid',
  })
  serviceId: string;

  @IsOptional()
  @IsNotEmpty()
  @Matches(/^data:image\/(png|jpeg);base64,/, { message: 'Invalid image format' })
  @ApiProperty({
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3',
    required: false,
  })
  image: string;
}
