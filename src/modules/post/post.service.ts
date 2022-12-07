import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PostRepository } from '@app/modules/post/post.repository';
import { CreatePostDto } from '@app/modules/post/dto/createPost.dto';
import { UserEntity } from '@app/modules/user/user.entity';
import { PostEntity } from '@app/modules/post/post.entity';
import { PostContentService } from '@app/modules/post-content/postContent.service';
import { UserService } from '@app/modules/user/user.service';
import { GetPostsQueryInterface } from '@app/modules/post/types/getPostsQuery.interface';
import { PostResponseDto } from '@app/modules/post/dto/postResponse.dto';
import { CommentService } from '@app/modules/comment/comment.service';
import { PostPreviewDto } from '@app/modules/post/dto/postPreview.dto';
import { ProfileService } from '@app/modules/profile/profile.service';

@Injectable()
export class PostService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly postRepository: PostRepository,
    private readonly postContentService: PostContentService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    @Inject(forwardRef(() => ProfileService))
    private readonly profileService: ProfileService,
  ) {}

  public async getPostPreviews(
    username: string,
    query: GetPostsQueryInterface,
  ): Promise<PostPreviewDto[]> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.user', 'users')
      .leftJoinAndSelect('posts.content', 'content')
      .andWhere('users.username = :username', { username })
      .limit(query.limit)
      .offset(query.offset);

    const posts = await queryBuilder.getMany();

    return posts.map((post) => ({
      id: post.id,
      firstContent: post.content[0],
      isMultipleContent: post.content.length > 1,
    }));
  }

  public async getFeed(
    currentUser: UserEntity,
    query: GetPostsQueryInterface,
  ): Promise<PostResponseDto[]> {
    const subscriptionsIds = await this.userService.getSubscriptionsIds(
      currentUser.id,
    );

    if (!subscriptionsIds.length) {
      return [];
    }

    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.user', 'users')
      .leftJoinAndSelect('users.profile', 'profiles')
      .leftJoinAndSelect('posts.comments', 'comments')
      .leftJoinAndSelect('posts.content', 'content')
      .andWhere('users.id IN (:...ids)', { ids: subscriptionsIds })
      .limit(query.limit)
      .offset(query.offset);

    const posts = await queryBuilder.getMany();

    return await Promise.all(
      posts.map(
        async (post) => await this.buildPostResponse(post, currentUser),
      ),
    );
  }

  public async getOnePost(
    postId: number,
    currentUser: UserEntity,
  ): Promise<PostResponseDto> {
    const post = await this.findByIdWithRequiredRelations(postId);

    if (!post) {
      throw new HttpException(
        'Post does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.buildPostResponse(post, currentUser);
  }

  public async createPost(
    dto: CreatePostDto,
    files: Express.Multer.File[],
    currentUser: UserEntity,
  ): Promise<PostResponseDto> {
    const newPost = await this.postRepository.createPost(dto, currentUser);

    await Promise.all(
      files.map(
        async (file) =>
          await this.postContentService.createPostContent(file, newPost),
      ),
    );

    await this.profileService.saveProfileToCache(currentUser);

    const post = (await this.findByIdWithRequiredRelations(
      newPost.id,
    )) as PostEntity;

    return await this.buildPostResponse(post, currentUser);
  }

  private async checkIsLiked(
    post: PostEntity,
    userId: number,
  ): Promise<boolean> {
    const user = await this.userService.findByIdWithRelations(userId, [
      'liked',
    ]);

    if (!user) {
      throw new HttpException(
        'User does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return !!user.liked.find((item) => item.id === post.id);
  }

  public async likePost(
    postId: number,
    currentUserId: number,
  ): Promise<PostResponseDto> {
    const user = await this.userService.findByIdWithRelations(currentUserId, [
      'liked',
    ]);

    if (!user) {
      throw new HttpException(
        'User does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const post = await this.findByIdWithRequiredRelations(postId);

    if (!post) {
      throw new HttpException(
        'Post does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isLiked = !!user.liked.find((item) => item.id === post.id);

    if (isLiked) {
      throw new HttpException(
        'Post is already liked',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    user.liked.push(post);

    post.likeCount += 1;

    await user.save();
    await post.save();

    return await this.buildPostResponse(post, user);
  }

  public async unlikePost(
    postId: number,
    currentUserId: number,
  ): Promise<PostResponseDto> {
    const user = await this.userService.findByIdWithRelations(currentUserId, [
      'liked',
    ]);

    if (!user) {
      throw new HttpException(
        'User does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const post = await this.findByIdWithRequiredRelations(postId);

    if (!post) {
      throw new HttpException(
        'Post does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isLiked = !!user.liked.find((item) => item.id === post.id);

    if (!isLiked) {
      throw new HttpException(
        `Didn't like the post`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    user.liked = user.liked.filter((item) => item.id !== post.id);
    post.likeCount -= 1;

    await user.save();
    await post.save();

    return this.buildPostResponse(post, user);
  }

  private async buildPostResponse(
    post: PostEntity,
    currentUser: UserEntity,
  ): Promise<PostResponseDto> {
    const lastLiker = await this.userService.getLastLiker(post.id);
    const isLiked = await this.checkIsLiked(post, currentUser.id);
    const comments = await this.commentService.getCommentList(
      post.id,
      currentUser,
      {
        limit: 3,
        offset: 0,
      },
    );

    return {
      id: post.id,
      author: {
        username: post.user.username,
        photo: post.user.profile.photo,
      },
      isAuthor: post.user.id === currentUser.id,
      title: post.title,
      content: post.content,
      isLiked,
      likeCount: post.likeCount,
      lastLiker: lastLiker?.username || null,
      commentCount: post.comments.length,
      comments,
    };
  }

  public async findByIdWithRelations(
    id: number,
    relations?: string[],
  ): Promise<PostEntity | null> {
    return await this.postRepository.findOne({ where: { id }, relations });
  }

  public async findByIdWithRequiredRelations(
    postId: number,
  ): Promise<PostEntity | null> {
    return await this.findByIdWithRelations(postId, [
      'user',
      'user.profile',
      'content',
      'comments',
    ]);
  }
}
