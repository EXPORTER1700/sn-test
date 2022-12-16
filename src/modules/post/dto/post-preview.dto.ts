import { PostContentEntity } from '@app/modules/post-content/post-content.entity';

export class PostPreviewDto {
  id: number;
  firstContent: PostContentEntity;
  isMultipleContent: boolean;
}
