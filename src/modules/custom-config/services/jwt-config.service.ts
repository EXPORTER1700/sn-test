import { Injectable } from '@nestjs/common';
import { CustomConfigService } from '@app/modules/custom-config/services/custom-config.service';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

@Injectable()
export class JwtConfigService {
  constructor(private readonly configService: CustomConfigService) {}

  public getJwtModuleConfig(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
    };
  }

  public getActivationTokenLifetime(): string {
    return this.configService.get<string>('ACTIVATION_TOKEN_LIFETIME');
  }

  public getResetPasswordTokenLifetime(): string {
    return this.configService.get<string>('RESET_PASSWORD_TOKEN_LIFETIME');
  }
}
