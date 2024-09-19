// src/notifications/strategies/gold-notification.strategy.ts
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { NotificationStrategy } from '../interfaces/notification-strategy.interface';

@Injectable()
export class GoldNotificationStrategy implements NotificationStrategy {
  sendProfileViewNotification(viewer: User, targetUser: User) {
    // Gold users receive a notification without viewer details
    console.log(`User ${targetUser.id} was viewed by someone.`);
  }
}
