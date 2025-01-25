import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
export class SellVoucherDto {
  @IsNotEmpty()
  @IsUUID()
  transactionId: string;
  @IsNotEmpty()
  @IsUUID()
  productId: string;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
