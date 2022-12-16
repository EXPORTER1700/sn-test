import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommentRepository } from '@app/modules/comment/comment.repository';
import { CreateCommentDto } from '@app/modules/comment/dto/create-comment.dto';
import { CommentEntity } from '@app/modules/comment/comment.entity';
import { UserService } from '@app/modules/user/user.service';
import { PostService } from '@app/modules/post/post.service';
import { ProfileService } from '@app/modules/profile/profile.service';
import { UserEntity } from '@app/modules/user/user.entity';
import { ProfileEntity } from '@app/modules/profile/profile.entity';
import { CommentAuthorDto } from '@app/modules/comment/dto/comment-author.dto';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';
import { CommentResponseDto } from '@app/modules/comment/dto/comment-response.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    private readonly profileService: ProfileService,
  ) {}

  public async createComment(
    dto: CreateCommentDto,
    userId: number,
  ): Promise<any> {
    const user = await this.userService.findByIdOrThrowError(userId);
    const post = await this.postService.findByIdOrThrowError(dto.post);
    const replyTo = dto.replyTo
      ? await this.findByIdOrThrowError(dto.replyTo)
      : null;
    const comment = await this.commentRepository.createComment(
      { text: dto.text },
      post,
      user,
      replyTo,
    );

    post.commentCount += 1;
    await post.save();

    return await this.buildCommentResponseDto(comment, user);
  }

  public async getCommentListByPostId(
    postId: number,
    query: BaseQueryDto,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.getCommentListByPostId(
      postId,
      query,
    );

    return await Promise.all(
      comments.map(
        async (comment) =>
          await this.buildCommentResponseDto(comment, comment.user),
      ),
    );
  }

  public async findById(commentId: number): Promise<CommentEntity | null> {
    return await this.commentRepository.findById(commentId);
  }

  public async findByIdOrThrowError(commentId: number): Promise<CommentEntity> {
    const comment = await this.findById(commentId);

    if (!comment) {
      throw new UnprocessableEntityException('Comment does not exist');
    }

    return comment;
  }

  private async buildCommentResponseDto(
    comment: CommentEntity, //With replyTo relation
    user: UserEntity,
  ): Promise<CommentResponseDto> {
    const profile = await this.profileService.findByUserIdOrThrowError(user.id);
    const author = this.buildCommentAuthorDto(user, profile);

    return {
      id: comment.id,
      text: comment.text,
      replyTo: comment.replyTo ? comment.replyTo.id : null,
      author,
    };
  }

  private buildCommentAuthorDto(
    //TODO make a common method for posts and comments?
    user: UserEntity,
    profile: ProfileEntity,
  ): CommentAuthorDto {
    return {
      username: user.username,
      photo: profile.photo,
    };
  }
}
