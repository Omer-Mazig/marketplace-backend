// src/notifications/events/product-delete.event.ts

import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';

export class ProductDeletedEvent {
  constructor(
    public readonly product: Product,
    public readonly affectedUsers: User[],
  ) {}
}
