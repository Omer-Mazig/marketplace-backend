import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './providers/products.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Notification } from 'src/notifications/notification.entity';
import { UserFinderProvider } from 'src/users/providers/user-finder.provider';
import { UserCreationProvider } from 'src/users/providers/user-creation.provider';
import { UserRepositoryProvider } from 'src/users/providers/user-repository.provider';
import { UserHashingProvider } from 'src/users/providers/user-hashing.provider';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    UsersService,
    UserFinderProvider,
    UserCreationProvider,
    UserRepositoryProvider,
    UserHashingProvider,
  ],
  imports: [
    TypeOrmModule.forFeature([Product, User, Notification]),
    UsersModule,
    AuthModule,
  ],
})
export class ProductsModule {}
