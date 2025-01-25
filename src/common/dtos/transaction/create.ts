import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { LanguageDto } from '../language';
export class CreateTransactionDto extends LanguageDto {
  @IsString()
  @ApiProperty({
    example: '',
    required: false,
    type: 'string',
  })
  customerAccountingCode: string;

  @IsString()
  @ApiProperty({
    example: '',
    required: false,
    type: 'uuid',
  })
  productId: string;

  @IsString()
  @ApiProperty({
    example: '',
    required: false,
    type: 'string',
  })
  fullName: string;

  @IsString()
  @ApiProperty({
    example: '',
    required: false,
    type: 'uuid',
  })
  customerId: string;

  @IsNumber()
  @ApiProperty({
    required: false,
    type: 'number',
  })
  quantity: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '',
    required: false,
    type: 'string',
  })
  source: string;

  @IsString()
  @ApiProperty({
    example: '',
    required: false,
    type: 'uuid',
  })
  statementId: string;
}
