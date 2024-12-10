import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './providers/wishlist.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
  imports: [NotificationsModule],
})
export class WishlistModule {}
