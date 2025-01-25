import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { PayloadById } from '../payload-by-id';

export class UpdateFacialDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: '5 TND',
    required: true,
  })
  label: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1.09)
  @ApiProperty({
    example: '5.7',
    required: true,
    type: 'number',
  })
  value: number;

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
export class UpdateFacialDtoTcp extends PayloadById {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateFacialDto)
  updateFacialDto: UpdateFacialDto;
}
