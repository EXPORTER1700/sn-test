import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '@app/modules/auth/decorators/getUser.decorator';
import { UserEntity } from '@app/modules/user/user.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from '@app/modules/post/dto/createPost.dto';
import { PostService } from '@app/modules/post/post.service';
import { PostFilesValidationPipe } from '@app/modules/post/pipes/postFilesValidation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { PostResponseDto } from '@app/modules/post/dto/postResponse.dto';
import { GetPostsQueryInterface } from '@app/modules/post/types/getPostsQuery.interface';

@Controller('post')
@UseGuards(AuthGuard())
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'content', maxCount: 10 }]))
  public createPost(
    @GetUser() user: UserEntity,
    @UploadedFiles(PostFilesValidationPipe)
    files: { content: Express.Multer.File[] },
    @Body() dto: CreatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.createPost(dto, files.content, user);
  }

  @Post('like/:id')
  public likePost(
    @Param('id') postId: number,
    @GetUser() user: UserEntity,
  ): Promise<PostResponseDto> {
    return this.postService.likePost(postId, user.id);
  }

  @Delete('like/:id')
  public unlikePost(
    @Param('id') postId: number,
    @GetUser() user: UserEntity,
  ): Promise<PostResponseDto> {
    return this.postService.unlikePost(postId, user.id);
  }

  @Get('feed')
  public getFeed(
    @GetUser() currentUser: UserEntity,
    @Query() query: GetPostsQueryInterface,
  ) {
    return this.postService.getFeed(currentUser, query);
  }

  @Get(':id')
  public getOnePost(
    @Param('id') postId: number,
    @GetUser() currentUser: UserEntity,
  ) {
    return this.postService.getOnePost(postId, currentUser);
  }

  @Get('preview/:username')
  public getPostsPreviews(
    @Param('username') username: string,
    @Query() query: GetPostsQueryInterface,
  ) {
    return this.postService.getPostPreviews(username, query);
  }
}
