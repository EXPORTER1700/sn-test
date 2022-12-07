import { Module } from '@nestjs/common';
import { FileController } from '@app/modules/file/file.controller';
import { FileService } from '@app/modules/file/file.service';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
