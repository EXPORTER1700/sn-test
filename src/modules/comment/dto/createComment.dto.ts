import { IsNumber, IsString, MaxLength, ValidateIf } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MaxLength(256)
  text: string;

  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  replyTo: number | null;

  @IsNumber()
  post: number;
}
