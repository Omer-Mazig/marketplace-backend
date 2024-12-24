import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProductDeletedEvent,
  ProductUpdatedEvent,
} from '../events/notification.events';
import { Notification } from '../notification.entity';

@Injectable()
export class NotificationsListener {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  @OnEvent('product.deleted')
  async handleProductDeletion(event: ProductDeletedEvent) {
    const { product } = event;
    console.log('product', product);

    if (!product.wishlistUsers || product.wishlistUsers.length === 0) {
      return;
    }

    const notifications = product.wishlistUsers.map((user) =>
      this.notificationsRepository.create({
        user,
        message: `The product '${product.name}' has been deleted.`,
        type: 'product_deleted',
      }),
    );

    await this.notificationsRepository.save(notifications);
  }

  @OnEvent('product.updated')
  async handleProductUpdate(event: ProductUpdatedEvent) {
    const { product } = event;

    if (!product.wishlistUsers || product.wishlistUsers.length === 0) {
      return;
    }

    const notifications = product.wishlistUsers.map((user) =>
      this.notificationsRepository.create({
        user,
        message: `The product '${product.name}' has been updated.`,
        type: 'product_updated',
        metadata: { productId: product.id, productName: product.name },
      }),
    );

    await this.notificationsRepository.save(notifications);
  }
}
