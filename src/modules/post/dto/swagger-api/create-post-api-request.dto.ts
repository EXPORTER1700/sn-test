import { CreatePostDto } from '@app/modules/post/dto/create-post.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostApiRequestDto extends CreatePostDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  content: Express.Multer.File[];
}
