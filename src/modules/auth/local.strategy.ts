import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@app/modules/auth/auth.service';
import { UserEntity } from '@app/modules/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<UserEntity> {
    const user = await this.authService.login(username, password);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
