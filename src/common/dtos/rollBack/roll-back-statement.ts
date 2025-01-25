/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class RollBackStatementDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 0,
    required: true,
    type: 'uuid',
  })
  id?: string;

  @IsOptional()
  @ApiProperty({
    example: 0,
    required: false,
  })
  updatedBy?: string;
}
