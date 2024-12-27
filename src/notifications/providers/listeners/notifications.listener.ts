import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProductDeletedEvent,
  ProductUpdatedEvent,
} from '../events/notification.events';
import { Notification } from '../../notification.entity';
import { Product } from 'src/products/product.entity';
import { NotificationType } from 'src/notifications/types/notifications.type';

@Injectable()
export class NotificationsListener {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  @OnEvent('product.deleted')
  async handleProductDeletion(event: ProductDeletedEvent) {
    const { product } = event;

    if (this._hasWishlist(product)) return;

    const metadata = { productName: product.name };

    await this._createAndSaveNotifications(
      product,
      'product.deleted',
      metadata,
    );
  }

  @OnEvent('product.updated')
  async handleProductUpdate(event: ProductUpdatedEvent) {
    const { product } = event;

    if (this._hasWishlist(product)) return;

    const metadata = { productId: product.id, productName: product.name };

    await this._createAndSaveNotifications(
      product,
      'product.updated',
      metadata,
    );
  }

  private _hasWishlist(product: Product) {
    return !product.wishlistUsers || product.wishlistUsers.length === 0;
  }

  private async _createAndSaveNotifications(
    product: Product,
    type: NotificationType,
    metadata: Record<string, any>,
  ) {
    const notifications = product.wishlistUsers.map((user) =>
      this.notificationsRepository.create({
        user,
        type,
        metadata,
      }),
    );

    try {
      await this.notificationsRepository.save(notifications);
    } catch (error) {
      console.error(
        '[NotificationsListener - createAndSaveNotifications]',
        error,
      );
      throw new RequestTimeoutException(
        'Unable to process your request. Please try later.',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }
}
