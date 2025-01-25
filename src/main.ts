import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { setupSwagger } from './common/config/swagger/swgger';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { HttpExceptionFilter } from './common/exception/excpetion-filtre.exception';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  //! ajouter le prot ala fire wall
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get<number>('PORT_TCP'),
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  setupSwagger(app);
  await app.startAllMicroservices();
  await app.listen(configService.get<number>('PORT'));
  console.log(`projet runing with ${configService.get<number>('PORT')}`);
}
bootstrap();
