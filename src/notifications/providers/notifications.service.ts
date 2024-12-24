import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../notification.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async getNotifications(activeUser: ActiveUserData) {
    try {
      const notifications = await this.notificationsRepository.find({
        where: {
          user: { id: activeUser.sub }, // Use the user's ID directly
        },
        order: {
          createdAt: 'DESC', // Optional: Order by newest notifications
        },
      });
      return notifications;
    } catch (error) {
      console.error('[NotificationsService - getNotifications]', error);
      throw new RequestTimeoutException(
        'Unable to fetch notifications. Please try again later.',
        { description: 'Error querying the database' },
      );
    }
  }
}
