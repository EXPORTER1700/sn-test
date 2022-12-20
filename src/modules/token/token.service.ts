import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ActivationTokenPayloadInterface } from '@app/modules/token/types/activation-token-payload.interface';
import { JwtConfigService } from '@app/modules/custom-config/services/jwt-config.service';
import { UpdateEmailTokenPayloadInterface } from '@app/modules/token/types/update-email-token-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: JwtConfigService,
  ) {}

  public generateActivationToken(
    payload: ActivationTokenPayloadInterface,
  ): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.getActivationTokenLifetime(),
    });
  }

  public verifyActivationToken(
    token: string,
  ): ActivationTokenPayloadInterface | never {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Token is not valid');
    }
  }

  public generateUpdateEmailToken(id: number, newEmail: string): string {
    return this.jwtService.sign(
      { id, newEmail },
      { expiresIn: this.configService.getActivationTokenLifetime() },
    );
  }

  public verifyUpdateEmailToken(
    token: string,
  ): UpdateEmailTokenPayloadInterface {
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
