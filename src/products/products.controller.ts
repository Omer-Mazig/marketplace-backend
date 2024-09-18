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
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

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

  @Delete(':productId')
  public deleteProduct(@Param('productId') productId: number) {
    return `Deleting ${productId}`;
  }

  @Post()
  public createProduct(
    @Body() createProductDto: CreateProductDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.productsService.createProduct(createProductDto, user);
  }

  @Patch()
  public updateProduct(@Body() updateProductDto) {
    return 'Creating Product';
  }
}
