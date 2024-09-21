import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { ProductCategory } from 'shared/src/product-categories.enum';

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

  @IsOptional()
  @IsString()
  imageURL?: string;

  @ValidateNested()
  @Type(() => User)
  owner: User;

  @IsArray()
  @IsEnum(ProductCategory, { each: true })
  categories: ProductCategory[];

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => User)
  // wishlistUsers: User[];
}
