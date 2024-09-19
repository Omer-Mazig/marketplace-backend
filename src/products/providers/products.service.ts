import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Product } from '../product.entity';
import { UserTier } from 'src/users/enums/user-tier.enum';
import { UsersService } from 'src/users/providers/users.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { PatchProductDto } from '../dtos/patch-product.dto';
import { EventBus } from '@nestjs/cqrs';
import { ProductDeleteEvent } from 'src/notifications/events/product-delete.event';
import { ProductUpdateEvent } from 'src/notifications/events/product-updated.event';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly eventBus: EventBus,
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

  // PUBLIC METHODS:
  public async getProductById(
    productId: number,
    relations: string[] = ['owner'],
  ) {
    let product: Product | null = null;
    try {
      product = await this.productsRepository.findOne({
        where: { id: productId },
        relations,
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
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  public async createProduct(
    createProductDto: CreateProductDto,
    activeUser: ActiveUserData,
  ) {
    const owner = await this.usersService.findOneById(activeUser.sub);
    await this._validateUserTierForProductCreation(owner.id, owner.userTier);

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

  public async patchProduct(
    productId: number,
    patchProductDto: PatchProductDto,
    activeUser: ActiveUserData,
  ) {
    const product = await this.getProductById(productId);
    this._checkOwnership(product, activeUser.sub);

    // Manually update the product properties
    product.name = patchProductDto.name ?? product.name;
    product.description = patchProductDto.description ?? product.description;
    product.price = patchProductDto.price ?? product.price;
    product.imageURL = patchProductDto.imageURL ?? product.imageURL;
    product.categories = patchProductDto.categories ?? product.categories;

    try {
      const updatedProduct = await this.productsRepository.save(product);

      const affectedUsers = updatedProduct.wishlistUsers;

      // Emit the event
      this.eventBus.publish(
        new ProductUpdateEvent(updatedProduct, affectedUsers),
      );

      return updatedProduct;
    } catch (error) {
      console.error('[ProductsService - patchProduct]', error);
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
    this._checkOwnership(product, activeUser.sub);

    try {
      await this.productsRepository.delete(productId);

      const affectedUsers = product.wishlistUsers;

      // Emit product delete event
      this.eventBus.publish(new ProductDeleteEvent(product, affectedUsers));
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

  // PRIVATE METHODS:
  private _checkOwnership(product: Product, userId: number) {
    if (product.owner.id !== userId) {
      throw new UnauthorizedException(
        'Cannot modify a product that you do not own',
      );
    }
  }

  private async _validateUserTierForProductCreation(
    ownerId: number,
    userTier: UserTier,
  ) {
    const ownerProductsCount = await this.productsRepository.count({
      where: { owner: { id: ownerId } },
    });

    if (userTier === UserTier.STANDARD && ownerProductsCount >= 1) {
      throw new BadRequestException(
        'STANDARD users can only have one product.',
      );
    } else if (userTier === UserTier.GOLD && ownerProductsCount >= 5) {
      throw new BadRequestException(
        'GOLD users can only have up to five products.',
      );
    }
  }
}
