import { DataSource, EntityRepository, Repository } from 'typeorm';
import { LikeEntity } from '@app/modules/like/like.entity';
import { UserEntity } from '@app/modules/user/user.entity';
import { PostEntity } from '@app/modules/post/post.entity';

@EntityRepository()
export class LikeRepository extends Repository<LikeEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(LikeEntity, dataSource.createEntityManager());
  }

  public async createLike(user: UserEntity, post: PostEntity): Promise<void> {
    const like = new LikeEntity();
    like.user = user;
    like.post = post;

    await like.save();
  }

  public async deleteLike(like: LikeEntity): Promise<void> {
    await like.remove();
  }

  public async findByUserIdAndPostId(
    userId: number,
    postId: number,
  ): Promise<LikeEntity | null> {
    return await super.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });
  }
}
