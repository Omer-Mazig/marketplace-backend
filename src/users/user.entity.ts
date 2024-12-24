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
import { Exclude } from 'class-transformer';
import { Notification } from 'src/notifications/notification.entity';

// TODO: add imageURL, chnage the naming in client from imageUrl
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

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({
    select: false, // This will exclude the password from queries by default
  })
  @Exclude()
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
  @JoinTable({
    name: 'user_wishlist_product',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'productId' },
  })
  wishlist: Product[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @ManyToMany(() => User, (user) => user.subscribedTo)
  @JoinTable()
  subscribers: User[];

  @ManyToMany(() => User, (user) => user.subscribers)
  subscribedTo: User[];
}
