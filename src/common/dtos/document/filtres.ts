import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination';

export class FiltersDocumentDto extends PaginationDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: '1',
    required: false,
    type: 'number',
  })
  status: number = 1;
}
