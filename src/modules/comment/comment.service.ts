import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CommentRepository } from '@app/modules/comment/comment.repository';
import { CreateCommentDto } from '@app/modules/comment/dto/createComment.dto';
import { UserEntity } from '@app/modules/user/user.entity';
import { PostService } from '@app/modules/post/post.service';
import { CommentEntity } from '@app/modules/comment/comment.entity';
import { CommentResponseDto } from '@app/modules/comment/dto/commentResponse.dto';
import { GetCommentListQueryInterface } from '@app/modules/comment/types/GetCommentListQuery.interface';
import { UserService } from '@app/modules/user/user.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async createComment(
    dto: CreateCommentDto,
    user: UserEntity,
  ): Promise<CommentResponseDto> {
    const post = await this.postService.findByIdWithRelations(dto.post);

    if (!post) {
      throw new HttpException(
        'Post does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let replyTo: CommentEntity | null = null;

    if (dto.replyTo) {
      replyTo = await this.findByIdWithRelations(dto.replyTo, ['post']);

      if (!replyTo) {
        throw new HttpException(
          'Comment does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      if (replyTo.post.id !== post.id) {
        throw new HttpException(
          "You can't reply to a comment that is under another post",
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const comment = await this.commentRepository.createComment(
      dto.text,
      user,
      post,
      replyTo,
    );

    return await this.buildCommentResponse(comment, user);
  }

  public async getCommentList(
    postId,
    currentUser: UserEntity,
    query: GetCommentListQueryInterface,
  ): Promise<CommentResponseDto[]> {
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.post', 'posts')
      .leftJoinAndSelect('comments.user', 'users')
      .leftJoinAndSelect('users.profile', 'profiles')
      .leftJoinAndSelect('comments.replyTo', 'replies')
      .andWhere('posts.id = :id', { id: postId })
      .orderBy('comments.createdAt', 'ASC')
      .limit(query.limit)
      .offset(query.offset);

    const comments = await queryBuilder.getMany();

    return await Promise.all(
      comments.map(
        async (comment) =>
          await this.buildCommentResponse(comment, currentUser),
      ),
    );
  }

  private async buildCommentResponse(
    comment: CommentEntity,
    currentUser: UserEntity,
  ): Promise<CommentResponseDto> {
    return {
      id: comment.id,
      text: comment.text,
      replyTo: comment.replyTo?.id || null,
      author: {
        username: comment.user.username,
        photo: comment.user.profile.photo,
      },
      isOwner: comment.user.id === currentUser.id,
    };
  }

  public async findByIdWithRelations(
    commentId: number,
    relations?: string[],
  ): Promise<CommentEntity | null> {
    return await this.commentRepository.findOne({
      where: { id: commentId },
      relations,
    });
  }
}
