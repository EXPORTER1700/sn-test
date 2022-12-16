import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as passport from 'passport';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.get(ConfigService);

  const redisClient = new Redis({
    host: config.get<string>('REDIS_HOST') as string,
    port: config.get<number>('REDIS_SESSION_PORT') as number,
  });
  const redisStore = connectRedis(session);
  const sessionStore = new redisStore({ client: redisClient });

  app.enableCors();
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser(config.get<string>('REDIS_SECRET') as string));
  app.use(
    session({
      name: config.get<string>('COOKIE_NAME') as string,
      secret: config.get<string>('REDIS_SECRET') as string,
      store: sessionStore,
      cookie: {
        httpOnly: true,
        maxAge:
          (config.get<number>('COOKIE_EXPIRE_DAY') as number) *
          24 *
          60 *
          60 *
          1000,
      },
      saveUninitialized: false,
      resave: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API with NestJS')
    .setDescription('API developed throughout the API with NestJS course')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const PORT = config.get('APP_PORT') || 3000;

  await app.listen(PORT, () => console.log(`App started on port: ${PORT}`));
}

bootstrap();
