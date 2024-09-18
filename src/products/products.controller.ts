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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Auth(AuthType.None)
  public getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':productId')
  @Auth(AuthType.None)
  public getProductById(@Param('productId') productId: number) {
    return this.productsService.getProductById(productId);
  }

  @Delete(':productId')
  public deleteProduct(@Param('productId') productId: number) {
    return `Deleting ${productId}`;
  }

  @Post()
  public createProduct(
    @Body() createProductDto: CreateProductDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.productsService.createProduct(createProductDto, activeUser);
  }

  @Patch()
  public updateProduct(@Body() updateProductDto) {
    return 'Creating Product';
  }
}
