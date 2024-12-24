import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../notification.entity';
import { Product } from 'src/products/product.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async notifyProductDeletion(productId: number) {
    let product: Product | null;

    // Step 1: Fetch the product
    try {
      product = await this.productRepository.findOne({
        where: { id: productId },
        relations: ['wishlistUsers'],
      });
    } catch (error) {
      console.error(
        `[NotificationsService] Error fetching product with ID ${productId}:`,
        error,
      );
      throw new Error(
        'Failed to retrieve product during notification process.',
      );
    }

    if (!product) {
      console.warn(
        `[NotificationsService] Product with ID ${productId} not found.`,
      );
      throw new Error('Product not found');
    }

    const notifications = product.wishlistUsers.map((user) => {
      try {
        return this.notificationRepository.create({
          user,
          message: `The product '${product.name}' has been deleted.`,
        });
      } catch (error) {
        console.error(
          `[NotificationsService] Error creating notification for user ID ${user.id}:`,
          error,
        );
        throw new Error(`Failed to create notification for user ID ${user.id}`);
      }
    });

    // Step 2: Save notifications
    try {
      await this.notificationRepository.save(notifications);
    } catch (error) {
      console.error(
        `[NotificationsService] Error saving notifications for product ID ${productId}:`,
        error,
      );
      throw new Error('Failed to save notifications for product deletion.');
    }
  }
}
