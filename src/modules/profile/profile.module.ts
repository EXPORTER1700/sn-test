import { Module } from '@nestjs/common';
import { ProfileController } from 'src/modules/profile/profile.controller';
import { ProfileService } from 'src/modules/profile/profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '@app/modules/profile/profile.entity';
import { ProfileRepository } from '@app/modules/profile/profile.repository';
import { FileModule } from '@app/modules/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity]), FileModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileService],
})
export class ProfileModule {}
