import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './providers/products.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotificationsService } from 'src/notifications/providers/notifications.service';
import { Notification } from 'src/notifications/notification.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, UsersService, NotificationsService],
  imports: [
    TypeOrmModule.forFeature([Product, User, Notification]),
    AuthModule,
    // NotificationsModule,
  ],
})
export class ProductsModule {}
