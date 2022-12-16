import { Module } from '@nestjs/common';
import { PostContentController } from 'src/modules/post-content/post-content.controller';
import { PostContentService } from 'src/modules/post-content/post-content.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostContentEntity } from '@app/modules/post-content/post-content.entity';
import { FileModule } from '@app/modules/file/file.module';
import { PostContentRepository } from '@app/modules/post-content/post-content.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostContentEntity]), FileModule],
  controllers: [PostContentController],
  providers: [PostContentService, PostContentRepository],
  exports: [PostContentService],
})
export class PostContentModule {}
