import { User } from 'src/users/user.entity';

export interface NotificationStrategy {
  sendProfileViewNotification(viewer: User, targetUser: User): void;
}
