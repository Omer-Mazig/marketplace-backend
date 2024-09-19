import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { NotificationStrategy } from '../interfaces/notification-strategy.interface';

@Injectable()
export class PremiumNotificationStrategy implements NotificationStrategy {
  sendProfileViewNotification(viewer: User, targetUser: User) {
    // Premium users receive full notifications
    console.log(
      `User ${targetUser.id} was viewed by ${viewer.firstName} ${viewer.lastName}.`,
    );
  }
}
