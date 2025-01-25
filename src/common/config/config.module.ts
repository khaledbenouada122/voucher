import { ConfigService, ConfigModule as NestConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [NestConfigModule.forRoot({ isGlobal: true })],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
