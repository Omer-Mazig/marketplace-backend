import { Controller, Post, Delete, Param } from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { WishlistService } from './providers/wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':productId')
  public addToWishlist(
    @Param('productId') productId: number,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.wishlistService.addToWishlist(productId, activeUser);
  }

  @Delete(':productId')
  public removeFromWishlist(
    @Param('productId') productId: number,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.wishlistService.removeFromWishlist(productId, activeUser);
  }
}
