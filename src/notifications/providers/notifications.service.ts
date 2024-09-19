import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { NotificationStrategy } from '../interfaces/notification-strategy.interface';
import { StandardNotificationStrategy } from './standard-notification.strategy';
import { GoldNotificationStrategy } from './gold-notification.strategy';
import { PremiumNotificationStrategy } from './premium-notification.strategy';
import { Product } from 'src/products/product.entity';

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

  async notifyProductUpdate(
    affectedUsers: User[],
    product: Product,
  ): Promise<void> {
    // Filter out the product owner from the list of users to notify
    const usersToNotify = affectedUsers.filter(
      (user) => user.id !== product.owner.id,
    );

    // Notify each user about the product update
    for (const user of usersToNotify) {
      await this._sendNotification(user, product, 'update');
    }
  }

  async notifyProductDeletion(
    affectedUsers: User[],
    product: Product,
  ): Promise<void> {
    // Filter out the product owner from the list of users to notify
    const usersToNotify = affectedUsers.filter(
      (user) => user.id !== product.owner.id,
    );

    // Notify each user about the product deletion
    for (const user of usersToNotify) {
      await this._sendNotification(user, product, 'delete');
    }
  }

  private async _sendNotification(
    user: User,
    product: Product,
    action: 'update' | 'delete',
  ): Promise<void> {
    // Implement the logic to send the notification
    // This could involve sending an email, push notification, etc.
    // For example:
    const actionMessage =
      action === 'update'
        ? `Product ${product.name} has been updated. Check it out!`
        : `Product ${product.name} has been removed.`;

    console.log(`Sending notification to user ${user.id}: ${actionMessage}`);

    // Example of notification payload:
    const notificationPayload = {
      userId: user.id,
      message: actionMessage,
    };

    // Replace this with actual notification sending logic
    await this._send(notificationPayload);
  }

  private async _send(payload: {
    userId: number;
    message: string;
  }): Promise<void> {
    // Actual notification sending logic goes here
    console.log(
      `Notification sent to user ${payload.userId}: ${payload.message}`,
    );
  }
}
