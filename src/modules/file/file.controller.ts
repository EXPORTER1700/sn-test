import { Controller, Get, Param, Res } from '@nestjs/common';
import { FileService } from '@app/modules/file/file.service';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly awsS3Service: FileService) {}

  @Get('*')
  getFile(@Param('0') key: string, @Res() res: Response) {
    const readStream = this.awsS3Service.getFile(key);
    readStream.pipe(res);
  }
}
