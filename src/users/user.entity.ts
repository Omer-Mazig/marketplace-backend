// src/users/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from 'src/products/product.entity';
import { UserTier } from './enums/user-tier.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Note: Store hashed passwords only!

  @Column({
    type: 'enum',
    enum: UserTier,
    default: UserTier.STANDARD,
  })
  userTier: UserTier;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.owner)
  products: Product[];

  @ManyToMany(() => Product, (product) => product.wishlistUsers)
  @JoinTable()
  wishlist: Product[];
}
