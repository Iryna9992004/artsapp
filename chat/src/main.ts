import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './shared/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: config.client.base_url,
  });
  await app.listen(config.base.port);
}
bootstrap();
