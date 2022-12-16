import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'test' })
  title: string;
}
