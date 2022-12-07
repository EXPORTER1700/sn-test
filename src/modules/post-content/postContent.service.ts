import { Injectable } from '@nestjs/common';
import { PostEntity } from '@app/modules/post/post.entity';
import { PostContentEntity } from '@app/modules/post-content/postContent.entity';
import { PostContentRepository } from '@app/modules/post-content/postContent.repository';
import { FileService } from '@app/modules/file/file.service';
import { PostContentTypesEnum } from '@app/modules/post-content/types/postContentTypes.enum';
import { UploadFileContentTypeEnum } from '@app/modules/file/types/uploadFileContentType.enum';

@Injectable()
export class PostContentService {
  constructor(
    private readonly postContentRepository: PostContentRepository,
    private readonly fileService: FileService,
  ) {}

  public async createPostContent(
    file: Express.Multer.File,
    post: PostEntity,
  ): Promise<PostContentEntity> {
    const type = file.mimetype.split('/')[0] as PostContentTypesEnum;

    const uploadResponse = await this.fileService.uploadFile(
      file,
      UploadFileContentTypeEnum.POST,
    );

    return await this.postContentRepository.createPostContent(
      uploadResponse.Key,
      type,
      post,
    );
  }

  public async deletePostContent(
    postContent: PostContentEntity,
  ): Promise<void> {
    await this.fileService.deleteFile(postContent.url);
    await postContent.remove();
  }
}
