import { Module } from '@nestjs/common';
import { LikeService } from 'src/modules/like/like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from '@app/modules/like/like.entity';
import { LikeRepository } from '@app/modules/like/like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity])],
  providers: [LikeService, LikeRepository],
  exports: [LikeService],
})
export class LikeModule {}
