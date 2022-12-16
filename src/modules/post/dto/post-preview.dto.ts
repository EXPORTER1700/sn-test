import { PostContentEntity } from '@app/modules/post-content/post-content.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PostPreviewDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ type: PostContentEntity })
  firstContent: PostContentEntity;
  @ApiProperty({ example: false })
  isMultipleContent: boolean;
}
