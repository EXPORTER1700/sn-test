import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateCommentDto } from '@app/modules/comment/dto/create-comment.dto';
import { GetCurrentUserId } from '@app/modules/auth/decorator/get-current-user-id.decorator';
import { CommentService } from '@app/modules/comment/comment.service';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  public createComment(
    @Body() dto: CreateCommentDto,
    @GetCurrentUserId() currentUserId: number,
  ) {
    return this.commentService.createComment(dto, currentUserId);
  }

  @Get(':postId')
  public getCommentListByPostId(
    @Param('postId') postId: number,
    @Query() query: BaseQueryDto,
  ) {
    return this.commentService.getCommentListByPostId(postId, query);
  }
}
