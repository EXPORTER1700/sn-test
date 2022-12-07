import { DataSource, EntityRepository, Repository } from 'typeorm';
import { PostEntity } from '@app/modules/post/post.entity';
import { CreatePostDto } from '@app/modules/post/dto/createPost.dto';
import { UserEntity } from '@app/modules/user/user.entity';

@EntityRepository()
export class PostRepository extends Repository<PostEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PostEntity, dataSource.createEntityManager());
  }

  public async createPost(
    dto: CreatePostDto,
    user: UserEntity,
  ): Promise<PostEntity> {
    const post = new PostEntity();
    Object.assign(post, dto);
    post.user = user;

    user.postsCount += 1;
    await user.save();

    return await post.save();
  }
}
