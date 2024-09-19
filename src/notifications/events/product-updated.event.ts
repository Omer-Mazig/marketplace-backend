import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';

export class ProductUpdateEvent {
  constructor(
    public readonly product: Product,
    public readonly affectedUsers: User[],
  ) {}
}
