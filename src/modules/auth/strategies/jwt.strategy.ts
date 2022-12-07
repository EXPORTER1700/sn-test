import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@app/modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@app/modules/user/user.entity';
import { TokenPayloadInterface } from '@app/modules/token/types/tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  public async validate({ id }: TokenPayloadInterface): Promise<UserEntity> {
    const user = await this.userService.findByIdWithRelations(id);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
