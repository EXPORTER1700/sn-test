import { DataSource, EntityRepository, Repository } from 'typeorm';
import { PostEntity } from '@app/modules/post/post.entity';
import { UserEntity } from '@app/modules/user/user.entity';
import { CreatePostDto } from '@app/modules/post/dto/create-post.dto';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';

@EntityRepository()
export class PostRepository extends Repository<PostEntity> {
  constructor(dataSource: DataSource) {
    super(PostEntity, dataSource.createEntityManager());
  }

  public async createPost(
    dto: CreatePostDto,
    user: UserEntity,
  ): Promise<PostEntity> {
    const post = new PostEntity();
    Object.assign(post, dto);
    post.user = user;
    return await post.save();
  }

  public async findById(postId: number): Promise<PostEntity | null> {
    return await super.findOne({ where: { id: postId } });
  }

  public async getPostListByUserId(
    userId: number,
    query: BaseQueryDto,
  ): Promise<PostEntity[]> {
    const queryBuilder = super
      .createQueryBuilder('posts')
      .andWhere('posts.user_id = :userId', { userId })
      .orderBy('posts.id', 'DESC')
      .limit(query.limit)
      .offset(query.offset);

    return await queryBuilder.getMany();
  }

  public async getPostsByUsersIdsWithUserRelation(
    ids: number[],
    query: BaseQueryDto,
  ): Promise<PostEntity[]> {
    const queryBuilder = super
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.user', 'users')
      .andWhere('posts.user IN (:...ids)', { ids })
      .orderBy('posts.id', 'DESC')
      .limit(query.limit)
      .offset(query.offset);

    return await queryBuilder.getMany();
  }
}
