import { Injectable } from '@nestjs/common';
import { CustomConfigService } from '@app/modules/custom-config/services/custom-config.service';
import { ClientConfiguration } from 'aws-sdk/clients/s3';

@Injectable()
export class S3ConfigService {
  constructor(private readonly configService: CustomConfigService) {}

  public getS3ClientConfig(): ClientConfiguration {
    return {
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_KEY_SECRET'),
      },
      region: this.configService.get('AWS_S3_REGION'),
    };
  }

  public getS3Bucket(): string {
    return this.configService.get('AWS_S3_BUCKET');
  }
}
