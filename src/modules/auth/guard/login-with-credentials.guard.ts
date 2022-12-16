import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginWithCredentialsGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();

      await super.logIn(request);

      return true;
    } catch (e) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
