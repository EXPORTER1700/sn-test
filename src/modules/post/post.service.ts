import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PostRepository } from '@app/modules/post/post.repository';
import { UserService } from '@app/modules/user/user.service';
import { CreatePostDto } from '@app/modules/post/dto/create-post.dto';
import { PostEntity } from '@app/modules/post/post.entity';
import { PostContentService } from '@app/modules/post-content/post-content.service';
import { UserEntity } from '@app/modules/user/user.entity';
import { ProfileEntity } from '@app/modules/profile/profile.entity';
import { PostAuthorDto } from '@app/modules/post/dto/post-author.dto';
import { PostContentEntity } from '@app/modules/post-content/post-content.entity';
import { ProfileService } from '@app/modules/profile/profile.service';
import { PostResponseDto } from '@app/modules/post/dto/post-response.dto';
import { SuccessResponseDto } from '@app/common/dto/success-response.dto';
import { LikeService } from '@app/modules/like/like.service';
import { PostPreviewDto } from '@app/modules/post/dto/post-preview.dto';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';
import { SubscriptionService } from '@app/modules/subscription/subscription.service';
import { CommentService } from '@app/modules/comment/comment.service';
import { defaultCommentCountConstant } from '@app/modules/post/types/default-comment-count.constant';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly postContentService: PostContentService,
    private readonly profileService: ProfileService,
    private readonly likeService: LikeService,
    private readonly subscriptionService: SubscriptionService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  public async createPost(
    dto: CreatePostDto,
    files: Express.Multer.File[],
    currentUserId: number,
  ): Promise<PostResponseDto> {
    const user = await this.userService.findByIdOrThrowError(currentUserId);
    const post = await this.postRepository.createPost(dto, user);
    const content = await Promise.all(
      files.map(
        async (file) =>
          await this.postContentService.createPostContent(file, post),
      ),
    );
    user.postCount += 1;
    await user.save();

    return await this.buildPostResponseDto(post, content, user);
  }

  public async getOne(
    postId: number,
    currentUserId: number,
  ): Promise<PostResponseDto> {
    const post = await this.findByIdOrThrowError(postId);
    const currentUser = await this.userService.findByIdOrThrowError(
      currentUserId,
    );
    const content = await this.postContentService.findAllByPostId(post.id);

    return await this.buildPostResponseDto(post, content, currentUser);
  }

  public async likePost(
    currentUserId: number,
    postId: number,
  ): Promise<SuccessResponseDto> {
    const user = await this.userService.findByIdOrThrowError(currentUserId);
    const post = await this.findByIdOrThrowError(postId);
    const isLiked = await this.likeService.checkLike(user.id, post.id);

    if (isLiked) {
      throw new UnprocessableEntityException('Post is already liked');
    }

    await this.likeService.createLike(user, post);
    post.likeCount += 1;
    await post.save();

    return new SuccessResponseDto();
  }

  public async unlikePost(
    currentUserId: number,
    postId: number,
  ): Promise<SuccessResponseDto> {
    const user = await this.userService.findByIdOrThrowError(currentUserId);
    const post = await this.findByIdOrThrowError(postId);
    const isLiked = await this.likeService.checkLike(user.id, post.id);

    if (!isLiked) {
      throw new UnprocessableEntityException('Post does not liked');
    }

    await this.likeService.deleteLike(user.id, post.id);
    post.likeCount -= 1;
    await post.save();

    return new SuccessResponseDto();
  }

  public async getPostPreviewsByUsername(
    username: string,
    query: BaseQueryDto,
  ): Promise<PostPreviewDto[]> {
    const user = await this.userService.findByUsernameOrThrowError(username);
    const posts = await this.postRepository.getPostListByUserId(user.id, query);

    return await Promise.all(
      posts.map(async (post) => await this.buildPostPreviewDto(post)),
    );
  }

  public async getFeed(
    currentUserId: number,
    query: BaseQueryDto,
  ): Promise<PostResponseDto[]> {
    const currentUser = await this.userService.findByIdOrThrowError(
      currentUserId,
    );

    const subscriptionsIds =
      await this.subscriptionService.getSubscriptionsIdsByUserId(currentUserId);

    if (!subscriptionsIds.length) {
      return [];
    }

    const posts = await this.postRepository.getPostsByUsersIdsWithUserRelation(
      subscriptionsIds,
      query,
    );

    return await Promise.all(
      posts.map(async (post) => {
        const content = await this.postContentService.findAllByPostId(post.id);

        return await this.buildPostResponseDto(post, content, post.user);
      }),
    );
  }

  public async findById(postId: number): Promise<PostEntity | null> {
    return this.postRepository.findById(postId);
  }

  public async findByIdOrThrowError(postId: number): Promise<PostEntity> {
    const post = await this.findById(postId);

    if (!post) {
      throw new UnprocessableEntityException('Post does not exist');
    }

    return post;
  }

  private async buildPostResponseDto(
    post: PostEntity,
    content: PostContentEntity[],
    user: UserEntity,
  ): Promise<PostResponseDto> {
    const profile = await this.profileService.findByUserId(user.id);

    if (!profile) {
      throw new UnprocessableEntityException('Profile does not exist');
    }

    const author = this.buildPostAuthorDto(user, profile);
    const isLiked = await this.likeService.checkLike(user.id, post.id);
    const comments = await this.commentService.getCommentListByPostId(post.id, {
      limit: defaultCommentCountConstant,
      offset: 0,
    });

    return { post, content, author, isLiked, comments };
  }

  private buildPostAuthorDto(
    user: UserEntity,
    profile: ProfileEntity,
  ): PostAuthorDto {
    return { username: user.username, photo: profile.photo };
  }

  private async buildPostPreviewDto(post: PostEntity): Promise<PostPreviewDto> {
    const firstContent = await this.postContentService.findFirstByPostId(
      post.id,
    );

    const isMultipleContent = await this.checkMultipleContent(post.id);

    return {
      id: post.id,
      firstContent,
      isMultipleContent,
    };
  }

  private async checkMultipleContent(postId: number): Promise<boolean> {
    const postContentCount = await this.postContentService.getCountByPostId(
      postId,
    );

    return postContentCount > 1;
  }
}
