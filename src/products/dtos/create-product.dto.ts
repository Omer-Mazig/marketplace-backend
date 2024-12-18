import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
  IsPositive,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { ProductCategory } from '../enums/product-category.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  stock: number;

  @IsOptional()
  @IsString()
  imageURL?: string;

  @IsArray()
  @IsEnum(ProductCategory, { each: true })
  categories: ProductCategory[];

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsBoolean()
  isNegotiable: boolean;

  @ValidateNested()
  @Type(() => User)
  owner: User;
}
