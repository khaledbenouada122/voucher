import { IsNotEmpty, IsUUID } from 'class-validator';
import { LanguageDto } from './language';
import { ApiProperty } from '@nestjs/swagger';

export class PayloadById extends LanguageDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: true,
    required: true,
    type: 'uuid',
  })
  id: string;
}
