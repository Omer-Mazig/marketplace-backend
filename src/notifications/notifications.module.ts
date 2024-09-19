import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileViewedHandler } from './handlers/profile-viewed.handler';
import { NotificationsService } from './providers/notifications.service';
import { StandardNotificationStrategy } from './providers/standard-notification.strategy';
import { GoldNotificationStrategy } from './providers/gold-notification.strategy';
import { PremiumNotificationStrategy } from './providers/premium-notification.strategy';
import { ProductUpdatedHandler } from './handlers/product-updated.handler';
import { ProductDeletedHandler } from './handlers/product-deleted.handler';

@Module({
  imports: [CqrsModule],
  providers: [
    NotificationsService,
    StandardNotificationStrategy,
    GoldNotificationStrategy,
    PremiumNotificationStrategy,
    ProductUpdatedHandler,
    ProductDeletedHandler,
    ProfileViewedHandler,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
