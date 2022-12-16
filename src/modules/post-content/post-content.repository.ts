import { DataSource, EntityRepository, Repository } from 'typeorm';
import { PostContentEntity } from '@app/modules/post-content/post-content.entity';
import { PostEntity } from '@app/modules/post/post.entity';
import { PostContentTypeEnum } from '@app/modules/post-content/types/post-content-type.enum';

@EntityRepository()
export class PostContentRepository extends Repository<PostContentEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PostContentEntity, dataSource.createEntityManager());
  }

  public async createPostContent(
    url: string,
    type: PostContentTypeEnum,
    post: PostEntity,
  ): Promise<PostContentEntity> {
    const postContent = new PostContentEntity();
    postContent.url = url;
    postContent.type = type;
    postContent.post = post;

    return await postContent.save();
  }

  public async findByPostId(postId: number): Promise<PostContentEntity[]> {
    return await super.find({ where: { post: { id: postId } } });
  }

  public async getCountByPostId(postId: number): Promise<number> {
    const queryBuilder = super
      .createQueryBuilder('content')
      .andWhere('content.post_id = :postId', { postId });

    return await queryBuilder.getCount();
  }

  public async findFirstByPostId(postId: number): Promise<PostContentEntity> {
    const queryBuilder = super
      .createQueryBuilder('content')
      .andWhere('content.post_id = :postId', { postId })
      .orderBy('content.created_at', 'DESC')
      .limit(1);

    return (await queryBuilder.getOne()) as PostContentEntity;
  }
}
