import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.get(ConfigService);

  app.setGlobalPrefix('/api');

  const PORT = config.get('APP_PORT') || 3000;

  await app.listen(PORT, () => console.log(`App started on port: ${PORT}`));
}

bootstrap();
