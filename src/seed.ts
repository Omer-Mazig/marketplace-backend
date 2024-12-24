import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
import { Notification } from './notifications/notification.entity';

import { UserTier } from 'src/users/enums/user-tier.enum';
import { ProductCategory } from 'src/products/enums/product-category.enum';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

const seed = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const productRepository = dataSource.getRepository(Product);
  const notificationsRepository = dataSource.getRepository(Notification);

  // Password hashing
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Create Users
  const users = [
    userRepository.create({
      firstName: 'Standard',
      lastName: 'User',
      email: 'standard@gmail.com',
      password: hashedPassword,
      userTier: UserTier.STANDARD,
      imageUrl: 'https://avatars.githubusercontent.com/u/114055368?v=4',
    }),
    userRepository.create({
      firstName: 'Gold',
      lastName: 'User',
      email: 'gold@gmail.com',
      password: hashedPassword,
      userTier: UserTier.GOLD,
      imageUrl: 'https://avatars.githubusercontent.com/u/114055368?v=4',
    }),
    userRepository.create({
      firstName: 'Platinum',
      lastName: 'User',
      email: 'platinum@gmail.com',
      password: hashedPassword,
      userTier: UserTier.PLATINUM,
      imageUrl: 'https://avatars.githubusercontent.com/u/114055368?v=4',
    }),
  ];

  await userRepository.save(users);

  // Assuming you have the following user tiers:
  const standardUser = users[0]; // Can list 1 product
  const goldUser = users[1]; // Can list up to 3 products
  const platinumUser = users[2]; // Can list unlimited products

  const products = [
    // Standard User: Only 1 product
    {
      name: 'Laptop',
      description: 'High-end gaming laptop',
      price: 1500,
      categories: [ProductCategory.ELECTRONICS],
      location: 'New York',
      isNegotiable: true,
      owner: standardUser, // Standard user
      viewCount: 0,
      imageURL: 'https://picsum.photos/800/1200',
    },

    // Gold User: Up to 3 products
    {
      name: 'Smartphone',
      description: 'Latest model smartphone',
      price: 999,
      categories: [ProductCategory.ELECTRONICS],
      location: 'San Francisco',
      isNegotiable: false,
      owner: goldUser, // Gold user
      viewCount: 0,
      imageURL: 'https://picsum.photos/800/1200',
    },
    {
      name: '4K TV',
      description: 'Ultra HD TV for home entertainment',
      price: 800,
      categories: [ProductCategory.ELECTRONICS],
      location: 'Chicago',
      isNegotiable: true,
      owner: goldUser, // Gold user
      viewCount: 0,
      imageURL: 'https://picsum.photos/800/1200',
    },
    {
      name: 'Winter Coat',
      description: 'Warm winter coat with insulated lining',
      price: 180,
      categories: [ProductCategory.FASHION],
      location: 'Boston',
      isNegotiable: false,
      owner: goldUser, // Gold user
      viewCount: 0,
      imageURL: 'https://picsum.photos/800/1200',
    },

    // Platinum User: Unlimited products
    {
      name: 'Smartwatch',
      description: 'Wearable tech for fitness tracking',
      price: 200,
      categories: [ProductCategory.ELECTRONICS],
      location: 'Los Angeles',
      isNegotiable: true,
      owner: platinumUser, // Platinum user
      viewCount: 0,
      imageURL: 'https://picsum.photos/800/1200',
    },
    {
      name: 'Wireless Earbuds',
      description: 'True wireless earbuds with noise-canceling',
      price: 120,
      categories: [ProductCategory.ELECTRONICS],
      location: 'Houston',
      isNegotiable: false,
      owner: platinumUser, // Platinum user
      viewCount: 0,
      imageURL: 'https://picsum.photos/800/1200',
    },
    {
      name: 'Leather Jacket',
      description: 'Classic leather jacket for men',
      price: 250,
      categories: [ProductCategory.FASHION],
      location: 'Las Vegas',
      isNegotiable: true,
      owner: platinumUser, // Platinum user
      viewCount: 0,
      imageURL: 'https://picsum.photos/800/1200',
    },
    {
      name: 'Sneakers',
      description: 'Comfortable sneakers for daily wear',
      price: 100,
      categories: [ProductCategory.FASHION, ProductCategory.CLOTHING],
      location: 'Miami',
      isNegotiable: true,
      owner: platinumUser, // Platinum user
      viewCount: 0,
      imageURL: 'https://picsum.photos/800/1200',
    },
    {
      name: 'Dining Table',
      description: 'Wooden dining table for 6 people',
      price: 300,
      categories: [ProductCategory.HOME, ProductCategory.FURNITURE],
      location: 'San Diego',
      isNegotiable: true,
      owner: platinumUser, // Platinum user
      viewCount: 0,
      imageURL: 'https://picsum.photos/800/1200',
    },
  ];

  await productRepository.save(products);

  console.log('Seed completed!');
};

// Initialize and run the seeder
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Product, Notification],
  synchronize: true, // Ensures the schema is synchronized with entities
  dropSchema: true, // Drops the schema and recreates it each time (deletes all data)
});

AppDataSource.initialize()
  .then(() => {
    seed(AppDataSource).then(() => {
      console.log('Database seeded successfully!');
      process.exit(0);
    });
  })
  .catch((error) => console.log('Error seeding database:', error));
