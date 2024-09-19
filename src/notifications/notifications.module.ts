import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductUpdateHandler } from './handlers/product-updated.handler';
import { ProfileViewedHandler } from './handlers/profile-viewed.handler';
import { NotificationsService } from './providers/notifications.service';
import { StandardNotificationStrategy } from './providers/standard-notification.strategy';
import { GoldNotificationStrategy } from './providers/gold-notification.strategy';
import { PremiumNotificationStrategy } from './providers/premium-notification.strategy';

@Module({
  imports: [CqrsModule],
  providers: [
    NotificationsService,
    StandardNotificationStrategy,
    GoldNotificationStrategy,
    PremiumNotificationStrategy,
    ProductUpdateHandler,
    ProfileViewedHandler,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
