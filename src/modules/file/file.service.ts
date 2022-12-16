import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';
import { Express } from 'express';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { join } from 'path';
import { Readable } from 'stream';
import { UploadFileContentTypeEnum } from '@app/modules/file/types/upload-file-content-type.enum';
import { S3ConfigService } from '@app/modules/custom-config/services/s3-config.service';

@Injectable()
export class FileService {
  private s3: S3;

  constructor(private readonly configService: S3ConfigService) {
    this.s3 = new S3(configService.getS3ClientConfig());
  }

  async uploadFile(
    file: Express.Multer.File,
    contentType: UploadFileContentTypeEnum,
  ): Promise<ManagedUpload.SendData | never> {
    const { buffer, originalname, mimetype } = file;
    const fileType = mimetype.split('/')[0];

    try {
      return await this.s3
        .upload({
          Bucket: this.configService.getS3Bucket(),
          Body: buffer,
          Key: join(
            fileType,
            fileType === 'image' ? contentType : '',
            `${v4()}-${originalname}`,
          ),
        })
        .promise();
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while loading the file',
      );
    }
  }

  public getFile(key: string): Readable {
    try {
      return this.s3
        .getObject({
          Bucket: this.configService.getS3Bucket(),
          Key: key,
        })
        .createReadStream();
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while downloading the file',
      );
    }
  }

  public async deleteFile(key: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: this.configService.getS3Bucket(),
      Key: key,
    });
  }
}
