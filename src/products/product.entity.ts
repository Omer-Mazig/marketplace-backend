// src/products/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { ProductCategory } from './enums/product-categories.enum';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'decimal',
  })
  price: number;

  @Column({
    nullable: true,
  })
  imageURL?: string;

  @Column({
    type: 'enum',
    enum: ProductCategory,
    array: true, // This allows storing multiple categories
  })
  categories: ProductCategory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToMany(() => User, (user) => user.wishlist, { onDelete: 'CASCADE' })
  wishlistUsers: User[];
}
