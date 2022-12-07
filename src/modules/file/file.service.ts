import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';
import { Express } from 'express';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { UploadFileContentTypeEnum } from '@app/modules/file/types/uploadFileContentType.enum';
import { join } from 'path';
import { Readable } from 'stream';

@Injectable()
export class FileService {
  private s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: configService.get('AWS_S3_ACCESS_KEY') as string,
        secretAccessKey: configService.get('AWS_S3_KEY_SECRET') as string,
      },
      region: configService.get('AWS_S3_REGION'),
    });
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
          Bucket: this.configService.get('AWS_S3_BUCKET') as string,
          Body: buffer,
          Key: join(
            fileType,
            fileType === 'image' ? contentType : '',
            `${v4()}-${originalname}`,
          ),
        })
        .promise();
    } catch (e) {
      throw new HttpException(
        'An error occurred while loading the file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public getFile(key: string): Readable {
    try {
      return this.s3
        .getObject({
          Bucket: this.configService.get('AWS_S3_BUCKET')!,
          Key: key,
        })
        .createReadStream();
    } catch (e) {
      throw new HttpException(
        'An error occurred while downloading the file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteFile(key: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: this.configService.get('AWS_S3_BUCKET')!,
      Key: key,
    });
  }
}
