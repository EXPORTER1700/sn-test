import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class PostFilesValidationPipe implements PipeTransform {
  transform(
    files: { content: Express.Multer.File[] },
    metadata: ArgumentMetadata,
  ) {
    if (!files.content) {
      throw new HttpException(
        'Image or video are required',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isFilesValid = files.content.reduce((acc, file) => {
      const type = file.mimetype.split('/')[0];

      if (type === 'image') {
        return file.size <= 1000 * 1000 * 2; // 2mb
      }

      if (type === 'video') {
        return file.size <= 1000 * 1000 * 16; // 16mb
      }

      return false;
    }, true);

    if (!isFilesValid) {
      throw new HttpException(
        'Pictures should be no more than two megabytes, and videos no more than 16 megabytes',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return files;
  }
}
