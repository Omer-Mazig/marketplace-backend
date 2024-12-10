import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User; // The user who will receive the notification

  @ManyToOne(() => Product, { nullable: true })
  product: Product; // The product related to the notification

  @ManyToOne(() => User, { nullable: true })
  sender: User; // The user who triggered the action (add/remove)

  @Column()
  action: string; // Action like 'add' or 'remove'
}
