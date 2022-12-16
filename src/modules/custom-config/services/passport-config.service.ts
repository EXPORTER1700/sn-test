import { Injectable } from '@nestjs/common';
import { CustomConfigService } from '@app/modules/custom-config/services/custom-config.service';
import { IAuthModuleOptions } from '@nestjs/passport/dist/interfaces/auth-module.options';

@Injectable()
export class PassportConfigService {
  constructor(private readonly configService: CustomConfigService) {}

  public getPassportModuleConfig(): IAuthModuleOptions {
    return {
      defaultStrategy: this.configService.get<string>('PASSPORT_STRATEGY'),
    };
  }
}
