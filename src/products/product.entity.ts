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
import { ProductCategory } from './enums/product-category.enum';

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
    transformer: {
      to: (value: number) => value, // When saving to the database
      from: (value: string) => parseFloat(value), // When reading from the database
    },
  })
  price: number;

  @Column({
    type: 'int',
    default: 1,
  })
  stock: number;

  @Column({
    nullable: true,
    default: null,
  })
  imageURL?: string;

  @Column({
    type: 'enum',
    enum: ProductCategory,
    array: true,
  })
  categories: ProductCategory[];

  @Column({
    type: 'varchar',
  })
  location: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isNegotiable: boolean;

  @Column({
    type: 'int',
    default: 0,
  })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToMany(() => User, (user) => user.wishlist, { onDelete: 'CASCADE' })
  wishlistUsers: User[];
}
