import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ProductCategory } from 'shared/src/product-categories.enum';

export class PatchProductDto extends PartialType(CreateProductDto) {
  // Explicitly make fields optional if they should not be required in patch
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsString()
  imageURL?: string;

  // Categories and wishlistUsers may not be intended for patch operations
  @IsOptional()
  @IsArray()
  @IsEnum(ProductCategory, { each: true })
  categories?: ProductCategory[];

  //   @IsOptional()
  //   @IsArray()
  //   @ValidateNested({ each: true })
  //   @Type(() => User)
  //   wishlistUsers?: User[];
}

// import { PartialType } from '@nestjs/mapped-types';
// import { CreateProductDto } from './create-product.dto';

// export class PatchProductDto extends PartialType(CreateProductDto) {}
