import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
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

  private async findEntity<T extends { id: number }>(
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

  async addToWishlist(productId: number, activeUser: ActiveUserData) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await this.findEntity(User, activeUser.sub, ['wishlist']);
      const product = await this.findEntity(Product, productId, [
        'wishlistUsers',
      ]); // Include 'wishlistUsers' if needed

      if (user.wishlist.some((p) => p.id === productId)) {
        throw new UnauthorizedException('Product is already in wishlist');
      }

      // Add product to user's wishlist
      user.wishlist.push(product);

      // Add user to product's wishlistUsers if not already present
      if (!product.wishlistUsers.some((u) => u.id === activeUser.sub)) {
        product.wishlistUsers.push(user);
      }

      // Save both entities concurrently
      await Promise.all([
        queryRunner.manager.save(User, user),
        queryRunner.manager.save(Product, product),
      ]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('[WishlistService - addToWishlist]', error);
      throw new Error('Unable to process your request. Please try later.');
    } finally {
      await queryRunner.release();
    }
  }

  async removeFromWishlist(productId: number, activeUser: ActiveUserData) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await this.findEntity(User, activeUser.sub, ['wishlist']);
      const product = await this.findEntity(Product, productId, [
        'wishlistUsers',
      ]); // Include 'wishlistUsers' if needed

      // Remove the product from the user's wishlist
      user.wishlist = user.wishlist.filter((p) => p.id !== productId);

      // Remove user from the product's wishlistUsers
      product.wishlistUsers = product.wishlistUsers.filter(
        (u) => u.id !== activeUser.sub,
      );

      // Save both entities concurrently
      await Promise.all([
        queryRunner.manager.save(User, user),
        queryRunner.manager.save(Product, product),
      ]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('[WishlistService - removeFromWishlist]', error);
      throw new Error('Unable to process your request. Please try later.');
    } finally {
      await queryRunner.release();
    }
  }
}
