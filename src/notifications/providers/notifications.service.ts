import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../notifications.entity';
import { NotificationsGateway } from '../notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private notificationsGateway: NotificationsGateway, // Inject the WebSocket gateway
  ) {}

  // Method to create a notification
  async createNotification(
    receiverId: number,
    message: string,
    productId: number,
    senderId: number,
    action: string,
  ) {
    const notification = this.notificationRepository.create({
      message,
      user: { id: receiverId },
      product: { id: productId },
      sender: { id: senderId },
      action,
    });

    await this.notificationRepository.save(notification);

    // Send real-time notification to the receiver
    this.notificationsGateway.notifyUser(receiverId, message);
  }

  // Other methods as needed, e.g., fetching notifications for a user
}
