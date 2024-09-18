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

  @ValidateNested()
  @Type(() => User)
  owner: User;

  @IsArray()
  @IsEnum(ProductCategory, { each: true })
  categories: ProductCategory[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => User)
  wishlistUsers: User[];
}
