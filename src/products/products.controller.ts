import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get()
  public getProducts() {
    return 'All Products';
  }

  @Get(':productId')
  public getProductById(@Param('productId') productId: string) {
    return `Product ${productId}`;
  }

  @Get(':userId')
  public getUserProducts(@Param('userId') userId: string) {
    return `user Products ${userId}`;
  }

  @Delete(':productId')
  public deleteProduct(@Param('productId') productId: string) {
    return `Deleting ${productId}`;
  }

  @Post()
  public createProduct(@Body() createProductDto) {
    return 'Creating Product';
  }

  @Patch()
  public updateProduct(@Body() updateProductDto) {
    return 'Creating Product';
  }
}
