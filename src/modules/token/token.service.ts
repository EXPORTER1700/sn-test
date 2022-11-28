import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from '@app/modules/token/types/tokenPayload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public generateAccessToken(payload: TokenPayloadInterface): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_LIFETIME'),
    });
  }

  public generateRefreshToken(payload: TokenPayloadInterface): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_LIFETIME'),
    });
  }

  public generateActivationToken(payload: TokenPayloadInterface): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('ACTIVATION_TOKEN_LIFETIME'),
    });
  }

  public verifyToken(token: string): TokenPayloadInterface {
    return this.jwtService.verify(token);
  }
}
