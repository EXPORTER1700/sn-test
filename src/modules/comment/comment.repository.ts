import { DataSource, EntityRepository, Repository } from 'typeorm';
import { CommentEntity } from '@app/modules/comment/comment.entity';
import { UserEntity } from '@app/modules/user/user.entity';
import { PostEntity } from '@app/modules/post/post.entity';

@EntityRepository()
export class CommentRepository extends Repository<CommentEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CommentEntity, dataSource.createEntityManager());
  }

  public async createComment(
    text: string,
    user: UserEntity,
    post: PostEntity,
    replyTo: CommentEntity | null,
  ): Promise<CommentEntity> {
    const comment = new CommentEntity();
    comment.text = text;
    comment.user = user;
    comment.post = post;
    comment.replyTo = replyTo;

    return await comment.save();
  }
}
