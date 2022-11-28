import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ClassTransformInterceptor } from '@app/utils/interceptors/classTransform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.get(ConfigService);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassTransformInterceptor());
  app.use(cookieParser());

  const PORT = config.get('APP_PORT') || 3000;

  await app.listen(PORT, () => console.log(`App started on port: ${PORT}`));
}

bootstrap();
