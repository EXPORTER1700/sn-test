import { Module } from '@nestjs/common';
import { UserController } from 'src/modules/user/user.controller';
import { UserService } from 'src/modules/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/modules/user/user.entity';
import { UserRepository } from '@app/modules/user/user.repository';
import { ProfileModule } from '@app/modules/profile/profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ProfileModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
