import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  user: User; // Recipient of the notification.

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  relatedUser: User | null; // User who triggered the notification (e.g., a new subscriber).

  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  product: Product | null;

  @Column({ type: 'varchar', nullable: true })
  type: string; // Type of notification (e.g., "product_update", "wishlist_batch").

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null; // Additional data for the notification.

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
