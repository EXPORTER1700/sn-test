import { Module } from '@nestjs/common';
import { SubscriptionService } from 'src/modules/subscription/subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from '@app/modules/subscription/subscription.entity';
import { SubscriptionRepository } from '@app/modules/subscription/subscription.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity])],
  providers: [SubscriptionService, SubscriptionRepository],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
