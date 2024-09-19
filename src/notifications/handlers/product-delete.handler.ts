// src/notifications/handlers/product-delete.handler.ts

import { EventsHandler, IEventHandler } from '@nestjs/cqrs'; // Adjust to your event bus library
import { ProductDeleteEvent } from '../events/product-delete.event';
import { NotificationsService } from '../providers/notifications.service';

@EventsHandler(ProductDeleteEvent)
export class ProductDeleteHandler implements IEventHandler<ProductDeleteEvent> {
  constructor(private readonly notificationsService: NotificationsService) {}

  async handle(event: ProductDeleteEvent): Promise<void> {
    const { product, affectedUsers } = event;
    this.notificationsService.notifyProductDeletion(affectedUsers, product);
  }
}
