import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from '@app/modules/comment/dto/createComment.dto';
import { GetUser } from '@app/modules/auth/decorators/getUser.decorator';
import { UserEntity } from '@app/modules/user/user.entity';
import { CommentService } from '@app/modules/comment/comment.service';
import { AuthGuard } from '@nestjs/passport';
import { GetCommentListQueryInterface } from '@app/modules/comment/types/GetCommentListQuery.interface';

@Controller('comment')
@UseGuards(AuthGuard())
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  public createComment(
    @Body() dto: CreateCommentDto,
    @GetUser() user: UserEntity,
  ) {
    return this.commentService.createComment(dto, user);
  }

  @Get(':postId')
  public getCommentsList(
    @Param('postId') postId: number,
    @Query() query: GetCommentListQueryInterface,
    @GetUser() currentUser: UserEntity,
  ) {
    return this.commentService.getCommentList(postId, currentUser, query);
  }
}
