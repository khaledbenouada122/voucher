import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { LanguageDto } from '../language';

export class ImportDocuementDto extends LanguageDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '',
    required: true,
    type: 'uuid',
  })
  productId: string;
  @IsNotEmpty()
  @ApiProperty({
    example: '',
    required: true,
    type: 'string',
  })
  delimiter: string;
  @IsNotEmpty()
  @ApiProperty({
    example: '',
    required: true,
    type: 'number',
  })
  positionCode: number;
  @IsNotEmpty()
  @ApiProperty({
    example: '',
    required: true,
    type: 'number',
  })
  positionSerial: number;
  @IsNotEmpty()
  @ApiProperty({
    example: '',
    required: true,
    type: 'number',
  })
  positionValidityDate: number;

  @IsNotEmpty()
  @Matches(/^data:text\/(csv|txt);base64,/, { message: 'Invalid image format' })
  @ApiProperty({
    example: 'data:text/csv;base64,iVBORw0KGgoAAAANSUhEUgAAA3',
    required: true,
  })
  csv: string;
}
