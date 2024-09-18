import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';

@Controller('products')
export class ProductsController {
  @Get()
  public getProducts() {
    return 'All Products';
  }

  @Get(':productId')
  public getProductById(@Param('productId') productId: number) {
    return `Product ${productId}`;
  }

  @Get(':userId')
  public getUserProducts(@Param('userId') userId: number) {
    return `user Products ${userId}`;
  }

  @Delete(':productId')
  public deleteProduct(@Param('productId') productId: number) {
    return `Deleting ${productId}`;
  }

  @Post()
  public createProduct(@Body() createProductDto: CreateProductDto) {
    return 'Creating Product';
  }

  @Patch()
  public updateProduct(@Body() updateProductDto) {
    return 'Creating Product';
  }
}
