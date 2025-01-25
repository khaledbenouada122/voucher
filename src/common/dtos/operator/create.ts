import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { LanguageDto } from '../language';

export class CreateOperatorDto extends LanguageDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'OOREDOO',
    required: true,
  })
  label: string;

  @MinLength(6)
  @ApiProperty({
    example: '*********',
    required: true,
  })
  description: string;
  @IsNotEmpty()
  @Matches(/^data:image\/(png|jpeg);base64,/, { message: 'Invalid image format' })
  @ApiProperty({
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3',
    required: true,
  })
  image: string;
}
