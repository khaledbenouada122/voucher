import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Matches, MinLength } from 'class-validator';
import { LanguageDto } from '../language';

export class CreateOperatorDto extends LanguageDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'OOREDOO',
    required: true,
  })
  label: string;

  @IsOptional()
  @ApiProperty({
    example: '*********',
    required: true,
  })
  description: string;
  @IsOptional()
  @Matches(/^data:image\/(png|jpeg);base64,/, { message: 'Invalid image format' })
  @ApiProperty({
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3',
    required: true,
  })
  image: string;
}
