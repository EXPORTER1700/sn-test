import { Module } from '@nestjs/common';
import { FileService } from '@app/modules/file/file.service';

@Module({
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
