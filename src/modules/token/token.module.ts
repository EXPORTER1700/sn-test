import { Module } from '@nestjs/common';
import { TokenService } from '@app/modules/token/token.service';

@Module({
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
