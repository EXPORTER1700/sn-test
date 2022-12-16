export class CreateCommentDto {
  text: string;
  replyTo: number | null;
  post: number;
}
