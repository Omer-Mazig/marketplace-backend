import { Product } from 'src/products/product.entity';

export class ProductDeletedEvent {
  constructor(public product: Product) {}
}

export class ProductUpdatedEvent {
  constructor(public product: Product) {}
}

// Future events can go here...
