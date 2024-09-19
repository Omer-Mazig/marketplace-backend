import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductUpdatedEvent } from '../events/product-updated.event';

@EventsHandler(ProductUpdatedEvent)
export class ProductUpdatedHandler
  implements IEventHandler<ProductUpdatedEvent>
{
  handle(event: ProductUpdatedEvent) {
    // Notify all users with the product in their wishlist
    event.product.wishlistUsers.forEach((user) => {
      console.log(
        `Notifying user ${user.id} about product ${event.product.id} update`,
      );
    });
  }
}
