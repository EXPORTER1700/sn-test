import { PostEntity } from '@app/modules/post/post.entity';
import { PostContentEntity } from '@app/modules/post-content/post-content.entity';
import { PostAuthorDto } from '@app/modules/post/dto/post-author.dto';
import { CommentResponseDto } from '@app/modules/comment/dto/comment-response.dto';

export class PostResponseDto {
  post: PostEntity;
  content: PostContentEntity[];
  author: PostAuthorDto;
  isLiked: boolean;
  comments: CommentResponseDto[];
}
