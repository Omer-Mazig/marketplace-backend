import {
  Injectable,
  RequestTimeoutException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { UsersService } from 'src/users/providers/users.service';
import { UserTier } from 'src/users/enums/user-tier.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    private readonly usersService: UsersService,
  ) {}

  public async getProducts() {
    try {
      return await this.productsRepository.find({
        relations: ['owner'],
      });
    } catch (error) {
      console.error('[ProductsService - getProducts]', error);
      throw new RequestTimeoutException(
        'Unable to process your request. Please try later.',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  public async deleteProduct(productId: number, activeUser: ActiveUserData) {
    const product = await this.getProductById(productId);
    if (product.owner.id !== activeUser.sub) {
      throw new UnauthorizedException(
        'Can not delete product that you do now own',
      );
    }

    try {
      await this.productsRepository.delete(productId);
    } catch (error) {
      console.error('[ProductsService - deleteProduct]', error);
      throw new RequestTimeoutException(
        'Unable to process your request. Please try later.',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    return { deleted: true, productId };
  }

  public async getProductById(productId: number) {
    let product: Product | null = null;
    try {
      product = await this.productsRepository.findOne({
        where: {
          id: productId,
        },
        relations: ['owner'],
      });
    } catch (error) {
      console.error('[ProductsService - getProductById]', error);
      throw new RequestTimeoutException(
        'Unable to process your request. Please try later.',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return product;
  }

  public async createProduct(
    createProductDto: CreateProductDto,
    activeUser: ActiveUserData,
  ) {
    const owner = await this.usersService.findOneById(activeUser.sub);

    const ownerProductsCount = await this.productsRepository.count({
      where: { owner: { id: owner.id } },
    });

    if (owner.userTier === UserTier.STANDARD && ownerProductsCount >= 1) {
      throw new BadRequestException(
        'STANDARD users can only have one product.',
      );
    } else if (owner.userTier === UserTier.GOLD && ownerProductsCount >= 5) {
      throw new BadRequestException(
        'GOLD users can only have up to five products.',
      );
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      owner,
    });

    try {
      return await this.productsRepository.save(product);
    } catch (error) {
      console.error('[ProductsService - createProduct]', error);
      throw new RequestTimeoutException(
        'Unable to process your request. Please try later.',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }
}
