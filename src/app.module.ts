import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@app/modules/user/user.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { TokenModule } from './modules/token/token.module';
import { RedisModule } from './modules/redis/redis.module';
import { JwtStrategy } from '@app/modules/auth/strategies/jwt.strategy';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(
        __dirname,
        '..',
        '..',
        `.env.${process.env.NODE_ENV || 'development'}`,
      ),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, 'migrations/**/*{.ts,.js}')],
        synchronize: false,
      }),
    }),
    {
      ...PassportModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService) => ({
          defaultStrategy: configService.get('PASSPORT_STRATEGY'),
        }),
      }),
      global: true,
    },
    {
      ...JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
        }),
      }),
      global: true,
    },
    UserModule,
    AuthModule,
    MailModule,
    TokenModule,
    RedisModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [ConfigService, JwtService, JwtStrategy],
})
export class AppModule {}
