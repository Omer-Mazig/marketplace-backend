import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './providers/products.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommandBus, EventBus, UnhandledExceptionBus } from '@nestjs/cqrs';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    UsersService,
    EventBus,
    CommandBus,
    UnhandledExceptionBus,
  ],
  imports: [
    TypeOrmModule.forFeature([Product, User]),
    AuthModule,
    NotificationsModule,
  ],
})
export class ProductsModule {}
