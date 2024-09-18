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
import { ProductsService } from './providers/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  public getProducts() {
    return this.productsService.getProducts();
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
