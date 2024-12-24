import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, Repository } from 'typeorm';

import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Product } from '../product.entity';
import { UserTier } from 'src/users/enums/user-tier.enum';
import { UsersService } from 'src/users/providers/users.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { PatchProductDto } from '../dtos/patch-product.dto';
import {
  ProductDeletedEvent,
  ProductUpdatedEvent,
} from 'src/notifications/events/notification.events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserFinderProvider } from 'src/users/providers/user-finder.provider';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly userFinderProvider: UserFinderProvider,
    private readonly eventEmitter: EventEmitter2, // Add EventEmitter
  ) {}

  // PUBLIC METHODS:
  // TODO: type for params
  public async find({ category }: { category: string }) {
    const categoryValue = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize the first letter

    try {
      return await this.productsRepository.find({
        relations: ['owner', 'wishlistUsers'],
        select: {
          owner: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        where: {
          categories: ArrayContains([categoryValue]), // If categories is an array
        },
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

  public async getProductById(productId: number) {
    let product: Product | null = null;
    try {
      product = await this.productsRepository.findOne({
        where: { id: productId },
        relations: ['owner', 'wishlistUsers'],
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
    const owner = await this.userFinderProvider.findOneById(activeUser.sub);
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
    product.stock = patchProductDto.stock ?? product.stock;
    product.imageURL = patchProductDto.imageURL ?? product.imageURL;
    product.categories = patchProductDto.categories ?? product.categories;

    try {
      const updatedProduct = await this.productsRepository.save(product);

      // Emit a ProductUpdatedEvent
      this.eventEmitter.emit(
        'product.updated',
        new ProductUpdatedEvent(updatedProduct),
      );

      return updatedProduct;
    } catch (error) {
      console.error('[ProductsService - patchProduct]', error);
      throw new RequestTimeoutException('Unable to update the product.');
    }
  }

  public async deleteProduct(productId: number, activeUser: ActiveUserData) {
    const product = await this.getProductById(productId);
    this._checkOwnership(product, activeUser.sub);

    try {
      await this.productsRepository.delete(productId);

      // Emit a ProductDeletedEvent
      this.eventEmitter.emit(
        'product.deleted',
        new ProductDeletedEvent(product),
      );
    } catch (error) {
      console.error('[ProductsService - deleteProduct]', error);
      throw new RequestTimeoutException('Unable to delete the product.');
    }

    return { deleted: true, productId };
  }

  // PRIVATE METHODS:
  private _checkOwnership(product: Product, userId: number) {
    if (product.owner.id !== userId) {
      throw new ForbiddenException(
        'Cannot modify a product that you do not own',
        {},
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
      throw new BadRequestException({
        message: 'STANDARD users can only have one product.',
        redirectToUpgradePlan: true,
      });
    } else if (userTier === UserTier.GOLD && ownerProductsCount >= 3) {
      throw new BadRequestException({
        message: 'GOLD users can only have up to five products.',
        redirectToUpgradePlan: true,
      });
    }
  }
}
