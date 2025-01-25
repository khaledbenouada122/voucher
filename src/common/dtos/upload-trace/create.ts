import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { LanguageDto } from '../language';

export class CreateFailedUploadDto extends LanguageDto {
  @IsNotEmpty()
  @IsString()
  serial: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  documentId: string;
}
