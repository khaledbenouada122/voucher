
// import { RabbitMqService } from './rabbitMq/rabbitmq.service';
import { LogsModule } from './logs/logs.module';

import { VoucherModule } from './voucher/voucher.module';

import { TransactionModule } from './transaction/transaction.module';
import { ProductModule } from './product/product.module';
import { OperatorModule } from './operator/operator.module';
import { FacialModule } from './facial/facial.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LanguageMiddleware } from 'src/common/middlewares/language.middleware';
import { DataBaseModule } from 'src/common/database/database.module';
import { StockModule } from './stock/stock.module';

//import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    LogsModule,
  
    VoucherModule,
    StockModule,
    ProductModule,
    OperatorModule,
    FacialModule,
   // RabbitmqModule,
    TransactionModule,
    StockModule,

    ConfigModule.forRoot({ isGlobal: true }),
    DataBaseModule,
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
