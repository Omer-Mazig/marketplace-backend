import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityTarget } from 'typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  // PUBLIC METHODS:

  async addToWishlist(productId: number, activeUser: ActiveUserData) {
    let user: User;
    let product: Product;
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Perform initial entity fetching and logical checks outside the transaction
      user = await this._findEntity(User, activeUser.sub, ['wishlist']);
      product = await this._findEntity(Product, productId, [
        'wishlistUsers',
        'owner',
      ]); // Assuming 'owner' relation exists

      // Check if the user is trying to add their own product
      if (product.owner.id === activeUser.sub) {
        throw new BadRequestException(
          'You cannot add your own product to the wishlist',
        );
      }

      if (user.wishlist?.some((p) => p.id === productId)) {
        // Throw specific exception before starting the transaction
        throw new BadRequestException('Product is already in wishlist');
      }

      // Add product to user's wishlist
      user.wishlist?.push(product);

      // Add user to product's wishlistUsers if not already present
      if (!product.wishlistUsers?.some((u) => u.id === activeUser.sub)) {
        product.wishlistUsers?.push(user);
      }

      // Now start the transaction only for database operations
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Save both entities concurrently
      await Promise.all([
        queryRunner.manager.save(User, user),
        queryRunner.manager.save(Product, product),
      ]);

      await queryRunner.commitTransaction();
    } catch (error) {
      // Rethrow known logical exceptions to let NestJS handle them
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Handle all other errors related to the transaction
      await queryRunner.rollbackTransaction();
      console.error('[WishlistService - addToWishlist]', error);
      throw new Error('Unable to process your request. Please try later.');
    } finally {
      await queryRunner.release();
    }
  }

  async removeFromWishlist(productId: number, activeUser: ActiveUserData) {
    let user: User;
    let product: Product;
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Perform initial entity fetching and logical checks outside the transaction
      user = await this._findEntity(User, activeUser.sub, ['wishlist']);
      product = await this._findEntity(Product, productId, ['wishlistUsers']);

      // Remove the product from the user's wishlist
      user.wishlist = user.wishlist?.filter((p) => p.id !== productId);

      // Remove user from the product's wishlistUsers
      product.wishlistUsers = product.wishlistUsers?.filter(
        (u) => u.id !== activeUser.sub,
      );

      // Now start the transaction only for database operations
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Save both entities concurrently
      await Promise.all([
        queryRunner.manager.save(User, user),
        queryRunner.manager.save(Product, product),
      ]);

      await queryRunner.commitTransaction();
    } catch (error) {
      // Rethrow known logical exceptions to let NestJS handle them
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Handle all other errors related to the transaction
      await queryRunner.rollbackTransaction();
      console.error('[WishlistService - removeFromWishlist]', error);
      throw new Error('Unable to process your request. Please try later.');
    } finally {
      await queryRunner.release();
    }
  }

  // PRIVATE METHODS:
  private async _findEntity<T extends { id: number }>(
    entityClass: EntityTarget<T>,
    id: number,
    relations: string[] = [],
  ): Promise<T> {
    const entityRepository = this.dataSource.getRepository(entityClass);
    const foundEntity = await entityRepository.findOne({
      where: { id } as any, // Use 'as any' here to cast the where clause to the expected type
      relations,
    });

    if (!foundEntity) {
      throw new NotFoundException(`${entityClass.constructor.name} not found`);
    }

    return foundEntity;
  }
}
