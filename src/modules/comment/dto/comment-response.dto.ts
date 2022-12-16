import { CommentAuthorDto } from '@app/modules/comment/dto/comment-author.dto';

export class CommentResponseDto {
  id: number;
  text: string;
  replyTo: number | null;
  author: CommentAuthorDto;
}
