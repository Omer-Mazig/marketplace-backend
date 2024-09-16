import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  sender: User;

  @ManyToOne(() => Product, (product) => product.messages, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
