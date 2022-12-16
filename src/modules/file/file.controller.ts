import { Controller, Get, Param, Res } from '@nestjs/common';
import { FileService } from '@app/modules/file/file.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('*')
  getFile(@Param('0') key: string, @Res() res: Response) {
    const readStream = this.fileService.getFile(key);
    readStream.pipe(res);
  }
}
