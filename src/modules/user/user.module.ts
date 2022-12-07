import { forwardRef, Module } from '@nestjs/common';
import { UserController } from 'src/modules/user/user.controller';
import { UserService } from 'src/modules/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/modules/user/user.entity';
import { UserRepository } from '@app/modules/user/user.repository';
import { ProfileModule } from '@app/modules/profile/profile.module';
import { PostModule } from '@app/modules/post/post.module';
import { AuthModule } from '@app/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => ProfileModule),
    forwardRef(() => PostModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
