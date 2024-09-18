// src/products/dto/create-product.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { ProductCategory } from '../enums/product-categories.enum';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  imageURL?: string;

  // Validate owner as a nested object of type User
  @ValidateNested()
  @Type(() => User)
  owner: User;

  // Validate categories as an array of enum values
  @IsArray()
  @IsEnum(ProductCategory, { each: true })
  categories: ProductCategory[];

  // Validate wishlistUsers as an array of User objects
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => User)
  wishlistUsers: User[];
}
