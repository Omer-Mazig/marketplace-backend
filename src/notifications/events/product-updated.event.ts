import { Product } from 'src/products/product.entity';

export class ProductUpdatedEvent {
  constructor(public product: Product) {}
}
