import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async addToWishlist(productId: number, activeUser: ActiveUserData) {
    const queryRunner = this.dataSource.createQueryRunner();

    // for test optemistic update
    // throw new Error();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await queryRunner.manager.findOne(User, {
        where: { id: activeUser.sub },
        relations: ['wishlist'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Check if product is already in the wishlist
      if (user.wishlist?.some((p) => p.id === productId)) {
        throw new UnauthorizedException('Product is already in wishlist');
      }

      // Add product to user's wishlist
      user.wishlist?.push(product);

      // Add user to product's wishlistUsers
      if (!product.wishlistUsers?.some((u) => u.id === activeUser.sub)) {
        product.wishlistUsers?.push(user);
      }

      // Save both entities
      await queryRunner.manager.save(User, user);
      await queryRunner.manager.save(Product, product);

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

    // for test optemistic update
    throw new Error();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await queryRunner.manager.findOne(User, {
        where: { id: activeUser.sub },
        relations: ['wishlist'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Remove the product from the user's wishlist
      user.wishlist = user.wishlist?.filter((p) => p.id !== productId);

      // Remove user from the product's wishlistUsers
      product.wishlistUsers = product.wishlistUsers?.filter(
        (u) => u.id !== activeUser.sub,
      );

      // Save both entities
      await queryRunner.manager.save(User, user);
      await queryRunner.manager.save(Product, product);

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
