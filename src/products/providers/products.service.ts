import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    private readonly usersService: UsersService,
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

  public async createProduct(
    createProductDto: CreateProductDto,
    user: ActiveUserData,
  ) {
    const owner = await this.usersService.findOneById(user.sub); // Handling errors in findOneById()

    const product = this.productsRepository.create({
      ...createProductDto,
      owner,
    });

    try {
      return await this.productsRepository.save(product);
    } catch (error) {
      console.error('[ProductsService - createProduct]', error);
      throw new RequestTimeoutException(
        'Undable to process you requst please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }
}
