import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Category } from 'src/categories/category.entity';
import { Message } from 'src/messages/message.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  imageURL: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => User, (user) => user.wishlist)
  wishlistUsers: User[];

  @OneToMany(() => Message, (message) => message.product)
  messages: Message[];
}
