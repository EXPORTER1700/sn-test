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
import { PostService } from '@app/modules/post/post.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostFilesValidationPipe } from '@app/modules/file/pipes/post-files-validation.pipe';
import { CreatePostDto } from '@app/modules/post/dto/create-post.dto';
import { GetCurrentUserId } from '@app/modules/auth/decorator/get-current-user-id.decorator';
import { PostResponseDto } from '@app/modules/post/dto/post-response.dto';
import { SuccessResponseDto } from '@app/common/dto/success-response.dto';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from '@app/modules/auth/guard/auth.guard';
import { UnauthorizedErrorApiResponseDto } from '@app/common/swagger-api-response/dto/unauthorized-error-api-response.dto';
import { UnprocessableErrorApiResponseDto } from '@app/common/swagger-api-response/dto/unprocessable-error-api-response.dto';
import { BadRequestErrorApiResponseDto } from '@app/common/swagger-api-response/dto/bad-request-error-api-response.dto';
import { CreatePostApiRequestDto } from '@app/modules/post/dto/swagger-api/create-post-api-request.dto';
import { PostPreviewDto } from '@app/modules/post/dto/post-preview.dto';

@Controller('post')
@ApiTags('post')
@ApiUnauthorizedResponse({
  type: UnauthorizedErrorApiResponseDto,
  description: 'Unauthorized',
})
@UseGuards(LocalAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiCreatedResponse({
    type: PostResponseDto,
    description: 'Post was successfully create',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorApiResponseDto,
    description: 'Not valid dto',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePostApiRequestDto })
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
  @ApiOkResponse({
    type: [PostPreviewDto],
    description: 'Return posts previews list',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  public getPreviewsByUsername(
    @Param('username') username: string,
    @Query() query: BaseQueryDto,
  ) {
    return this.postService.getPostPreviewsByUsername(username, query);
  }

  @Get('feed')
  @ApiOkResponse({
    type: [PostResponseDto],
    description: 'Return feed',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  public getFeed(
    @GetCurrentUserId() currentUserId: number,
    @Query() query: BaseQueryDto,
  ): Promise<PostResponseDto[]> {
    return this.postService.getFeed(currentUserId, query);
  }

  @Get(':id')
  @ApiOkResponse({
    type: PostResponseDto,
    description: 'Return one post by id',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'Post does not exist',
  })
  public getOne(
    @Param('id') postId: number,
    @GetCurrentUserId() currentUserId: number,
  ) {
    return this.postService.getOne(postId, currentUserId);
  }

  @Post('like/:id')
  @ApiOkResponse({
    type: SuccessResponseDto,
    description: 'Success',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'Post is already liked',
  })
  public likePost(
    @GetCurrentUserId() currentUserId: number,
    @Param('id') postId: number,
  ): Promise<SuccessResponseDto> {
    return this.postService.likePost(currentUserId, postId);
  }

  @Delete('like/:id')
  @ApiOkResponse({
    type: SuccessResponseDto,
    description: 'Success',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'Post does not liked',
  })
  public unlikePost(
    @GetCurrentUserId() currentUserId: number,
    @Param('id') postId: number,
  ): Promise<SuccessResponseDto> {
    return this.postService.unlikePost(currentUserId, postId);
  }

  @Delete(':id')
  public deletePost(
    @GetCurrentUserId() currentUserId: number,
    @Param('id') postId: number,
  ): Promise<SuccessResponseDto> {
    return this.postService.deletePost(postId, currentUserId);
  }
}
