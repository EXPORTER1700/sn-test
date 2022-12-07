export class CommentResponseDto {
  id: number;
  text: string;
  author: { username: string; photo: string | null };
  replyTo: number | null;
  isOwner: boolean;
}
