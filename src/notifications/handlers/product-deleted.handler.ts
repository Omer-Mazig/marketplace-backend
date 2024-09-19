// src/notifications/handlers/product-delete.handler.ts

import { EventsHandler, IEventHandler } from '@nestjs/cqrs'; // Adjust to your event bus library
import { NotificationsService } from '../providers/notifications.service';
import { ProductDeletedEvent } from '../events/product-deleted.event';

@EventsHandler(ProductDeletedEvent)
export class ProductDeletedHandler
  implements IEventHandler<ProductDeletedEvent>
{
  constructor(private readonly notificationsService: NotificationsService) {}

  async handle(event: ProductDeletedEvent): Promise<void> {
    const { product, affectedUsers } = event;
    this.notificationsService.notifyProductDeletion(affectedUsers, product);
  }
}
