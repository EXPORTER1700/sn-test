import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserEntity } from '@app/modules/user/user.entity';
import { PostEntity } from '@app/modules/post/post.entity';
import { LikeRepository } from '@app/modules/like/like.repository';

@Injectable()
export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  public async createLike(user: UserEntity, post: PostEntity): Promise<void> {
    return await this.likeRepository.createLike(user, post);
  }

  public async deleteLike(userId: number, postId: number): Promise<void> {
    const like = await this.likeRepository.findByUserIdAndPostId(
      userId,
      postId,
    );

    if (!like) {
      throw new UnprocessableEntityException('Like does not exist');
    }

    await this.likeRepository.deleteLike(like);
  }

  public async checkLike(userId: number, postId: number): Promise<boolean> {
    const like = await this.likeRepository.findByUserIdAndPostId(
      userId,
      postId,
    );

    return Boolean(like);
  }
}
