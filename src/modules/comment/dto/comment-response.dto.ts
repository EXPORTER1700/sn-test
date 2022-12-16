import { CommentAuthorDto } from '@app/modules/comment/dto/comment-author.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({ example: 2 })
  id: number;
  @ApiProperty({ example: 'test comment' })
  text: string;
  @ApiProperty({ example: 1 })
  replyTo: number | null;
  @ApiProperty({ type: CommentAuthorDto })
  author: CommentAuthorDto;
}
