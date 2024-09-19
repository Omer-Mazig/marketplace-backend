// src/notifications/handlers/product-update.handler.ts

import { EventsHandler, IEventHandler } from '@nestjs/cqrs'; // Adjust to your event bus library
import { NotificationsService } from '../providers/notifications.service';
import { ProductUpdateEvent } from '../events/product-updated.event';

@EventsHandler(ProductUpdateEvent)
export class ProductUpdateHandler implements IEventHandler<ProductUpdateEvent> {
  constructor(private readonly notificationsService: NotificationsService) {}

  async handle(event: ProductUpdateEvent): Promise<void> {
    const { product, affectedUsers } = event;
    this.notificationsService.notifyProductUpdate(affectedUsers, product);
  }
}
