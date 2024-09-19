// src/notifications/handlers/product-update.handler.ts

import { EventsHandler, IEventHandler } from '@nestjs/cqrs'; // Adjust to your event bus library
import { NotificationsService } from '../providers/notifications.service';
import { ProductUpdatedEvent } from '../events/product-updated.event';

@EventsHandler(ProductUpdatedEvent)
export class ProductUpdatedHandler
  implements IEventHandler<ProductUpdatedEvent>
{
  constructor(private readonly notificationsService: NotificationsService) {}

  async handle(event: ProductUpdatedEvent): Promise<void> {
    const { product, affectedUsers } = event;
    this.notificationsService.notifyProductUpdate(affectedUsers, product);
  }
}
