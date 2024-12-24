import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../notification.entity';
import { Product } from 'src/products/product.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getNotifications(activeUser: ActiveUserData) {
    try {
      const notifications = await this.notificationRepository.find({
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

  async notifyProductDeletion(product: Product) {
    if (!product) {
      console.warn(`[NotificationsService] Product data is missing.`);
      throw new NotFoundException('Product not found');
    }

    const notifications = product.wishlistUsers.map((user) => {
      try {
        return this.notificationRepository.create({
          user,
          message: `The product '${product.name}' has been deleted.`,
          type: 'product_deleted',
        });
      } catch (error) {
        console.error(
          `[NotificationsService] Error creating notification for user ID ${user.id}:`,
          error,
        );
        throw new Error(`Failed to create notification for user ID ${user.id}`);
      }
    });

    // Save notifications
    try {
      await this.notificationRepository.save(notifications);
    } catch (error) {
      console.error(
        `[NotificationsService] Error saving notifications for product ID ${product.id}:`,
        error,
      );
      throw new Error('Failed to save notifications for product deletion.');
    }
  }
}
