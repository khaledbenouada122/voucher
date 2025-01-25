import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, Matches, MinLength, ValidateNested } from 'class-validator';
import { PayloadById } from '../payload-by-id';

export class UpdateOperatorDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: 'OOREDOO',
    required: true,
  })
  label: string;

  @IsOptional()
  @MinLength(6)
  @ApiProperty({
    example: '*********',
    required: true,
  })
  description: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
    type: 'boolean',
  })
  enabled: boolean;
  @IsOptional()
  @IsNotEmpty()
  @Matches(/^data:image\/(png|jpeg);base64,/, { message: 'Invalid image format' })
  @ApiProperty({
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3',
    required: true,
  })
  image: string;
}

export class UpdateOperatorDtoTcp extends PayloadById {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateOperatorDto)
  updateOperatorDto: UpdateOperatorDto;
}

