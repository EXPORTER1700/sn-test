import { DataSource, EntityRepository, Repository } from 'typeorm';
import { PostContentEntity } from '@app/modules/post-content/postContent.entity';
import { PostContentTypesEnum } from '@app/modules/post-content/types/postContentTypes.enum';
import { PostEntity } from '@app/modules/post/post.entity';

@EntityRepository()
export class PostContentRepository extends Repository<PostContentEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PostContentEntity, dataSource.createEntityManager());
  }

  public async createPostContent(
    url: string,
    type: PostContentTypesEnum,
    post: PostEntity,
  ): Promise<PostContentEntity> {
    const postContent = new PostContentEntity();
    postContent.url = url;
    postContent.type = type;
    postContent.post = post;

    return postContent.save();
  }
}
