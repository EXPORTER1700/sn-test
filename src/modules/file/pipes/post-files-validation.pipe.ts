import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class PostFilesValidationPipe implements PipeTransform {
  public transform(
    files: { content: Express.Multer.File[] },
    metadata: ArgumentMetadata,
  ) {
    if (!files.content) {
      throw new UnprocessableEntityException('Image or video are required');
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
      throw new UnprocessableEntityException(
        'Pictures should be no more than 2 megabytes, and videos no more than 16 megabytes',
      );
    }

    return files;
  }
}
