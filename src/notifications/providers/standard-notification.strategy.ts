import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { NotificationStrategy } from '../interfaces/notification-strategy.interface';

@Injectable()
export class StandardNotificationStrategy implements NotificationStrategy {
  sendProfileViewNotification(viewer: User, targetUser: User) {
    // Standard users do not receive profile view notifications
  }
}
