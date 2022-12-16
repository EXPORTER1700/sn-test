import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '@app/modules/user/user.entity';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  serializeUser(user: UserEntity, done: CallableFunction): void {
    done(null, user.id);
  }

  deserializeUser(userId: number, done: CallableFunction): void {
    done(null, userId);
  }
}
