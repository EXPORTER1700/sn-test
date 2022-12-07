import { IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(256)
  title: string;
}
