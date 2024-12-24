import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './providers/products.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Notification } from 'src/notifications/notification.entity';
import { UserFinderProvider } from 'src/users/providers/user-finder.provider';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, UserFinderProvider],
  imports: [
    TypeOrmModule.forFeature([Product, User, Notification]),
    UsersModule,
  ],
})
export class ProductsModule {}
