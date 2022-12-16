import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from '@app/modules/post/post.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostFilesValidationPipe } from '@app/modules/file/pipes/post-files-validation.pipe';
import { CreatePostDto } from '@app/modules/post/dto/create-post.dto';
import { GetCurrentUserId } from '@app/modules/auth/decorator/get-current-user-id.decorator';
import { PostResponseDto } from '@app/modules/post/dto/post-response.dto';
import { SuccessResponseDto } from '@app/common/dto/success-response.dto';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'content', maxCount: 10 }]))
  public createPost(
    @UploadedFiles(PostFilesValidationPipe)
    files: { content: Express.Multer.File[] },
    @GetCurrentUserId() currentUserId: number,
    @Body() dto: CreatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.createPost(dto, files.content, currentUserId);
  }

  @Get('previews/:username')
  public getPreviewsByUsername(
    @Param('username') username: string,
    @Query() query: BaseQueryDto,
  ) {
    return this.postService.getPostPreviewsByUsername(username, query);
  }

  @Get('feed')
  public getFeed(
    @GetCurrentUserId() currentUserId: number,
    @Query() query: BaseQueryDto,
  ) {
    return this.postService.getFeed(currentUserId, query);
  }

  @Get(':id')
  public getOne(
    @Param('id') postId: number,
    @GetCurrentUserId() currentUserId: number,
  ) {
    return this.postService.getOne(postId, currentUserId);
  }

  @Post('like/:id')
  public likePost(
    @GetCurrentUserId() currentUserId: number,
    @Param('id') postId: number,
  ): Promise<SuccessResponseDto> {
    return this.postService.likePost(currentUserId, postId);
  }

  @Delete('like/:id')
  public unlikePost(
    @GetCurrentUserId() currentUserId: number,
    @Param('id') postId: number,
  ): Promise<SuccessResponseDto> {
    return this.postService.unlikePost(currentUserId, postId);
  }
}
