import { CommentResponseDto } from '@app/modules/comment/dto/commentResponse.dto';
import { PostContentEntity } from '@app/modules/post-content/postContent.entity';

export class PostResponseDto {
  id: number;
  author: {
    username: string;
    photo: string | null;
  };
  isAuthor: boolean;
  title: string;
  content: PostContentEntity[];
  isLiked: boolean;
  likeCount: number;
  lastLiker: string | null;
  commentCount: number;
  comments: CommentResponseDto[];
}
