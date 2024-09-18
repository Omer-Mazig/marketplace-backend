import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './providers/products.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, UsersService],
  imports: [TypeOrmModule.forFeature([Product, User]), AuthModule],
})
export class ProductsModule {}
