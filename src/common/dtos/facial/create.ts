import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { LanguageDto } from '../language';

export class CreateFacialDto extends LanguageDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '5 TND',
    required: true,
  })
  label: string;
  @IsNotEmpty()
  @IsNumber()
  @Min(1.09)
  @ApiProperty({
    example: '5.7',
    required: true,
    type: 'number',
  })
  value: number;
}
