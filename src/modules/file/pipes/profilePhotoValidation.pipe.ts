import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class ProfilePhotoValidationPipe implements PipeTransform {
  public transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file) {
      return undefined;
    }

    const fileType = file.mimetype.split('/')[0];
    const fileSize = file.size;

    if (fileType !== 'image' || fileSize >= 1000 * 1000 * 2) {
      throw new UnprocessableEntityException(
        'Pictures should be no more than two megabytes',
      );
    }

    return file;
  }
}
