import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(
        __dirname,
        `../${process.env.NODE_ENV || 'development'}.env`,
      ),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, 'migrations/**/*{.ts,.js}')],
        synchronize: false,
      }),
    }),
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
