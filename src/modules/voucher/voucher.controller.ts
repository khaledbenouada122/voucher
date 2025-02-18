import { Controller, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { VoucherService } from './voucher.service';

@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('purchase/:voucherId')
  async purchaseVoucher(
    @Param('voucherId', ParseIntPipe) voucherId: number,
    @Body('userId', ParseIntPipe) userId: number,
    @Body('amount') amount: number,
  ) {
    return await this.voucherService.purchaseVoucher(userId, voucherId, amount);
  }
}
