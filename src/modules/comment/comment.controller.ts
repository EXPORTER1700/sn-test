import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from '@app/modules/comment/dto/create-comment.dto';
import { GetCurrentUserId } from '@app/modules/auth/decorator/get-current-user-id.decorator';
import { CommentService } from '@app/modules/comment/comment.service';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from '@app/modules/auth/guard/auth.guard';
import { UnauthorizedErrorApiResponseDto } from '@app/common/swagger-api-response/dto/unauthorized-error-api-response.dto';
import { CommentResponseDto } from '@app/modules/comment/dto/comment-response.dto';
import { BadRequestErrorApiResponseDto } from '@app/common/swagger-api-response/dto/bad-request-error-api-response.dto';
import { UnprocessableErrorApiResponseDto } from '@app/common/swagger-api-response/dto/unprocessable-error-api-response.dto';

@Controller('comment')
@ApiTags('comment')
@ApiUnauthorizedResponse({
  type: UnauthorizedErrorApiResponseDto,
  description: 'Unauthorized',
})
@ApiCookieAuth()
@UseGuards(LocalAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiCreatedResponse({
    type: CommentResponseDto,
    description: 'Comment was successfully create',
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorApiResponseDto,
    description: 'Not valid dto',
  })
  @ApiUnauthorizedResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User, post or reply comment are does not exist',
  })
  public createComment(
    @Body() dto: CreateCommentDto,
    @GetCurrentUserId() currentUserId: number,
  ) {
    return this.commentService.createComment(dto, currentUserId);
  }

  @Get(':postId')
  @ApiOkResponse({
    type: [CommentResponseDto],
    description: 'Return comments list',
  })
  public getCommentListByPostId(
    @Param('postId') postId: number,
    @Query() query: BaseQueryDto,
  ) {
    return this.commentService.getCommentListByPostId(postId, query);
  }
}
