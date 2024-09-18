import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  public async getProducts() {
    try {
      return await this.productsRepository.find({});
    } catch (error) {
      console.error('[ProductsService - getProducts]', error);
      throw new RequestTimeoutException(
        'Undable to process you requst please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }
}
