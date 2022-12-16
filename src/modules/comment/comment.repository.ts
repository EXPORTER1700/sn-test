import { DataSource, EntityRepository, Repository } from 'typeorm';
import { CommentEntity } from '@app/modules/comment/comment.entity';
import { CreateCommentDto } from '@app/modules/comment/dto/create-comment.dto';
import { PostEntity } from '@app/modules/post/post.entity';
import { UserEntity } from '@app/modules/user/user.entity';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';

@EntityRepository()
export class CommentRepository extends Repository<CommentEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CommentEntity, dataSource.createEntityManager());
  }

  public async createComment(
    dto: Omit<CreateCommentDto, 'post' | 'replyTo'>,
    post: PostEntity,
    user: UserEntity,
    replyTo: CommentEntity | null,
  ): Promise<CommentEntity> {
    const comment = new CommentEntity();
    Object.assign(comment, dto);
    comment.user = user;
    comment.post = post;
    comment.replyTo = replyTo;

    return await comment.save();
  }

  public async findById(commentId: number): Promise<CommentEntity | null> {
    return await super.findOne({ where: { id: commentId } });
  }

  public async getCommentListByPostId(
    postId: number,
    query: BaseQueryDto,
  ): Promise<CommentEntity[]> {
    const queryBuilder = super
      .createQueryBuilder('comments')
      .andWhere('comments.post = :id', { id: postId })
      .leftJoinAndSelect('comments.replyTo', 'replyTo')
      .leftJoinAndSelect('comments.user', 'users')
      .orderBy('comments.id', 'DESC')
      .limit(query.limit)
      .offset(query.offset);

    return await queryBuilder.getMany();
  }
}
