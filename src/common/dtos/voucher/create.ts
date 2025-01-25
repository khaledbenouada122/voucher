import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { LanguageDto } from '../language';
export class CreateVoucherDto extends LanguageDto {
  @IsNotEmpty()
  @IsString()
  code: string;
  @IsNotEmpty()
  @IsString()
  serial: string;
  @IsNotEmpty()
  @IsDate()
  validityDate: Date;
  createdBy: string;
  @IsNotEmpty()
  productId: string;
  @IsNotEmpty()
  documentId: string;
}
