import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserRepository } from '@app/modules/user/user.repository';
import { CreateUserDto } from '@app/modules/user/dto/createUser.dto';
import { UserEntity } from '@app/modules/user/user.entity';
import { ProfileService } from '@app/modules/profile/profile.service';
import { PostService } from '@app/modules/post/post.service';
import { UpdateUserDto } from '@app/modules/user/dto/updateUser.dto';
import { ProfileResponseDto } from '@app/modules/profile/dto/profileResponse.dto';
import { UpdatePasswordDto } from '@app/modules/user/dto/updatePassword.dto';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@app/modules/auth/auth.service';
import { ResetPasswordDto } from '@app/modules/auth/dto/resetPassword.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => ProfileService))
    private readonly profileService: ProfileService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.findByEmail(dto.email);

    if (userByEmail) {
      throw new UnprocessableEntityException(
        'Username or email is already taken',
      );
    }

    const userByUsername = await this.findByUsernameWithRelations(dto.username);

    if (userByUsername) {
      throw new UnprocessableEntityException(
        'Username or email is already taken',
      );
    }

    dto.password = await this.hashPassword(dto.password);

    const user = await this.userRepository.createUser(dto);

    await this.profileService.createProfile(user);

    return user;
  }

  public async updateUser(
    dto: UpdateUserDto,
    currentUser: UserEntity,
  ): Promise<ProfileResponseDto> {
    const userByEmail = await this.findByEmail(dto.email);

    if (userByEmail && userByEmail.id !== currentUser.id) {
      throw new UnprocessableEntityException(
        'Username or email is already taken',
      );
    }

    const userByUsername = await this.findByUsernameWithRelations(dto.username);

    if (userByUsername && userByUsername.id !== currentUser.id) {
      throw new UnprocessableEntityException(
        'Username or email is already taken',
      );
    }

    const updatedUser = Object.assign(currentUser, dto);

    await updatedUser.save();

    return await this.profileService.buildProfileResponse(
      updatedUser,
      updatedUser,
    );
  }

  public async updatePassword(
    dto: UpdatePasswordDto,
    currentUser,
    res: Response,
  ): Promise<void> {
    const isOldPasswordCompare = await bcrypt.compare(
      dto.oldPassword,
      currentUser.password,
    );

    if (!isOldPasswordCompare) {
      throw new UnprocessableEntityException('Old password is not valid');
    }

    currentUser.password = await this.hashPassword(dto.newPassword);
    await currentUser.save();

    await this.authService.logout(currentUser.id);

    return res.redirect(this.configService.get('FRONTEND_URL') as string);
  }

  public async resetPassword(
    dto: ResetPasswordDto,
    email: string,
  ): Promise<UserEntity> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnprocessableEntityException('Not valid email');
    }

    user.password = await this.hashPassword(dto.password);

    return await user.save();
  }

  private async hashPassword(password): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async getSubscriptionsIds(userId: number): Promise<number[]> {
    const user = await this.findByIdWithRelations(userId, ['subscriptions']);

    if (!user) {
      throw new HttpException(
        'User does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user.subscriptions.map((user) => user.id);
  }

  public async getLastLiker(postId: number): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.liked', 'liked')
      .andWhere('liked.id = :id', { id: postId })
      .limit(1);

    return await queryBuilder.getOne();
  }

  public async findByIdWithRelations(
    id: number,
    relations?: string[],
  ): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { id }, relations });
  }

  public async findByUsernameWithRelations(
    username: string,
    relations?: string[],
  ): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { username },
      relations,
    });
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
