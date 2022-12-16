import { Injectable } from '@nestjs/common';
import { PostContentRepository } from '@app/modules/post-content/post-content.repository';
import { PostEntity } from '@app/modules/post/post.entity';
import { PostContentEntity } from '@app/modules/post-content/post-content.entity';
import { PostContentTypeEnum } from '@app/modules/post-content/types/post-content-type.enum';
import { UploadFileContentTypeEnum } from '@app/modules/file/types/upload-file-content-type.enum';
import { FileService } from '@app/modules/file/file.service';

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
    const type = file.mimetype.split('/')[0] as PostContentTypeEnum;

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

  public async findAllByPostId(postId: number): Promise<PostContentEntity[]> {
    return await this.postContentRepository.findByPostId(postId);
  }

  public async getCountByPostId(postId: number): Promise<number> {
    return await this.postContentRepository.getCountByPostId(postId);
  }

  public async findFirstByPostId(postId: number): Promise<PostContentEntity> {
    return await this.postContentRepository.findFirstByPostId(postId);
  }
}
