import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.get(ConfigService);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());

  const PORT = config.get('APP_PORT') || 3000;

  await app.listen(PORT, () => console.log(`App started on port: ${PORT}`));
}

bootstrap();
