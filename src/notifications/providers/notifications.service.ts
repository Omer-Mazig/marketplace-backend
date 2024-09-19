import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { NotificationStrategy } from '../interfaces/notification-strategy.interface';
import { StandardNotificationStrategy } from './standard-notification.strategy';
import { GoldNotificationStrategy } from './gold-notification.strategy';
import { PremiumNotificationStrategy } from './premium-notification.strategy';

@Injectable()
export class NotificationsService {
  private strategy: NotificationStrategy;

  constructor(
    private readonly standardNotification: StandardNotificationStrategy,
    private readonly goldNotification: GoldNotificationStrategy,
    private readonly premiumNotification: PremiumNotificationStrategy,
  ) {}

  setStrategy(userTier: string) {
    switch (userTier) {
      case 'PREMIUM':
        this.strategy = this.premiumNotification;
        break;
      case 'GOLD':
        this.strategy = this.goldNotification;
        break;
      default:
        this.strategy = this.standardNotification;
    }
  }

  sendProfileViewNotification(viewer: User, targetUser: User) {
    this.strategy.sendProfileViewNotification(viewer, targetUser);
  }
}
