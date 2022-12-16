import { PostEntity } from '@app/modules/post/post.entity';
import { PostContentEntity } from '@app/modules/post-content/post-content.entity';
import { PostAuthorDto } from '@app/modules/post/dto/post-author.dto';
import { CommentResponseDto } from '@app/modules/comment/dto/comment-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty({ type: PostEntity })
  post: PostEntity;
  @ApiProperty({ type: [PostContentEntity] })
  content: PostContentEntity[];
  @ApiProperty({ type: PostAuthorDto })
  author: PostAuthorDto;
  @ApiProperty({ example: false })
  isLiked: boolean;
  @ApiProperty({ type: CommentResponseDto })
  comments: CommentResponseDto[];
}
