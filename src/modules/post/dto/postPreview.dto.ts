import { PostContentEntity } from '@app/modules/post-content/postContent.entity';

export class PostPreviewDto {
  id: number;
  firstContent: PostContentEntity;
  isMultipleContent: boolean;
}
