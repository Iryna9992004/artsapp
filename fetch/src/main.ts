import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './shared/config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/fetch');
  app.enableCors({ origin: config.frontend.url });
  await app.listen(config.base.port);
}
bootstrap();
