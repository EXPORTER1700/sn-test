import { Injectable } from '@nestjs/common';
import { CustomConfigService } from '@app/modules/custom-config/services/custom-config.service';

@Injectable()
export class UrlConfigService {
  constructor(private readonly configService: CustomConfigService) {}

  public getFrontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL');
  }

  public getFrontendLoginUrl(): string {
    return this.getFrontendUrl() + '/login';
  }

  public getFrontendConfirmEmailUrl(): string {
    return this.getFrontendUrl() + '/confirm-email';
  }

  public getFrontendResetPasswordUrl(): string {
    return this.getFrontendUrl() + '/reset-password';
  }

  public getBackendUrl() {
    const host = this.configService.get('APP_HOST');
    const port = this.configService.get('APP_PORT');
    return `http://${host}:${port}/api`;
  }
}
