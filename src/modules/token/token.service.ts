import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadInterface } from '@app/modules/token/types/token-payload.interface';
import { JwtConfigService } from '@app/modules/custom-config/services/jwt-config.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: JwtConfigService,
  ) {}

  public generateActivationToken(payload: TokenPayloadInterface): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.getActivationTokenLifetime(),
    });
  }

  public verifyActivationToken(token: string): TokenPayloadInterface | never {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Token is not valid');
    }
  }

  public generateResetPasswordToken(email: string) {
    return this.jwtService.sign(
      { email },
      {
        expiresIn: this.configService.getResetPasswordTokenLifetime(),
      },
    );
  }
  public verifyResetPasswordToken(token: string): { email: string } {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Token is not valid');
    }
  }
}
