import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomConfigService {
  constructor(private readonly configService: ConfigService) {}

  public get<T>(name: string): T {
    const value = this.configService.get<T>(name);

    if (value === undefined) {
      throw new InternalServerErrorException(
        `${name} parameter does not specified in .env file`,
      );
    }

    return value;
  }

  public getOptional<T>(name: string): T | undefined {
    return this.configService.get<T>(name);
  }
}
