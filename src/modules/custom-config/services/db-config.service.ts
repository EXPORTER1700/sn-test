import { Injectable } from '@nestjs/common';
import { CustomConfigService } from '@app/modules/custom-config/services/custom-config.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { join } from 'path';

@Injectable()
export class DbConfigService {
  constructor(private readonly configService: CustomConfigService) {}

  public getDbConnection(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('POSTGRES_PORT'),
      username: this.configService.get<string>('POSTGRES_USERNAME'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      database: this.configService.get<string>('POSTGRES_DB'),
      entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
      migrations: [join(__dirname, '../../migrations/**/*{.ts,.js}')],
      synchronize: false,
    };
  }
}
