import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
import { UserTier } from 'src/users/enums/user-tier.enum';
import { ProductCategory } from 'src/products/enums/product-category.enum';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

const seed = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const productRepository = dataSource.getRepository(Product);

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
    }),
    userRepository.create({
      firstName: 'Gold',
      lastName: 'User',
      email: 'gold@gmail.com',
      password: hashedPassword,
      userTier: UserTier.GOLD,
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
    // Category: ELECTRONICS
    {
      name: 'Laptop',
      description: 'High-end gaming laptop',
      price: 1500,
      categories: [ProductCategory.ELECTRONICS],
      location: 'New York',
      isNegotiable: true,
      owner: standardUser, // Standard user (only one product)
      viewCount: 0,
    },
    {
      name: 'Smartphone',
      description: 'Latest model smartphone',
      price: 999,
      categories: [ProductCategory.ELECTRONICS],
      location: 'San Francisco',
      isNegotiable: false,
      owner: goldUser, // Gold user (can list up to 3 products)
      viewCount: 0,
    },
    {
      name: '4K TV',
      description: 'Ultra HD TV for home entertainment',
      price: 800,
      categories: [ProductCategory.ELECTRONICS],
      location: 'Chicago',
      isNegotiable: true,
      owner: goldUser, // Gold user (can list up to 3 products)
      viewCount: 0,
    },
    {
      name: 'Smartwatch',
      description: 'Wearable tech for fitness tracking',
      price: 200,
      categories: [ProductCategory.ELECTRONICS],
      location: 'Los Angeles',
      isNegotiable: true,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },
    {
      name: 'Wireless Earbuds',
      description: 'True wireless earbuds with noise-canceling',
      price: 120,
      categories: [ProductCategory.ELECTRONICS],
      location: 'Houston',
      isNegotiable: false,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },

    // Category: FASHION
    {
      name: 'Leather Jacket',
      description: 'Classic leather jacket for men',
      price: 250,
      categories: [ProductCategory.FASHION],
      location: 'Las Vegas',
      isNegotiable: true,
      owner: standardUser, // Standard user (only one product)
      viewCount: 0,
    },
    {
      name: 'Winter Coat',
      description: 'Warm winter coat with insulated lining',
      price: 180,
      categories: [ProductCategory.FASHION],
      location: 'Boston',
      isNegotiable: false,
      owner: goldUser, // Gold user (can list up to 3 products)
      viewCount: 0,
    },
    {
      name: 'Sneakers',
      description: 'Comfortable sneakers for daily wear',
      price: 100,
      categories: [ProductCategory.FASHION, ProductCategory.CLOTHING],
      location: 'Miami',
      isNegotiable: true,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },
    {
      name: 'Sunglasses',
      description: 'Stylish sunglasses with UV protection',
      price: 80,
      categories: [ProductCategory.FASHION],
      location: 'Los Angeles',
      isNegotiable: false,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },
    {
      name: 'Jeans',
      description: 'Denim jeans with a slim fit',
      price: 50,
      categories: [ProductCategory.FASHION],
      location: 'New York',
      isNegotiable: true,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },

    // Category: HOME
    {
      name: 'Dining Table',
      description: 'Wooden dining table for 6 people',
      price: 300,
      categories: [ProductCategory.HOME, ProductCategory.FURNITURE],
      location: 'San Diego',
      isNegotiable: true,
      owner: standardUser, // Standard user (only one product)
      viewCount: 0,
    },
    {
      name: 'Couch',
      description: 'Comfortable couch with 3 seats',
      price: 450,
      categories: [ProductCategory.HOME, ProductCategory.FURNITURE],
      location: 'Dallas',
      isNegotiable: false,
      owner: goldUser, // Gold user (can list up to 3 products)
      viewCount: 0,
    },
    {
      name: 'Coffee Maker',
      description: 'Brew perfect coffee every morning',
      price: 100,
      categories: [ProductCategory.HOME, ProductCategory.APPLIANCES],
      location: 'Atlanta',
      isNegotiable: false,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },
    {
      name: 'Lamps',
      description: 'Modern lamps for living room decor',
      price: 50,
      categories: [ProductCategory.HOME, ProductCategory.FURNITURE],
      location: 'Boston',
      isNegotiable: true,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },
    {
      name: 'Curtains',
      description: 'Heavy blackout curtains for bedrooms',
      price: 120,
      categories: [ProductCategory.HOME],
      location: 'Chicago',
      isNegotiable: false,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },

    // Category: SPORTS
    {
      name: 'Soccer Ball',
      description: 'High-quality soccer ball for training',
      price: 30,
      categories: [ProductCategory.SPORTS],
      location: 'Denver',
      isNegotiable: true,
      owner: standardUser, // Standard user (only one product)
      viewCount: 0,
    },
    {
      name: 'Tennis Racket',
      description: 'Professional-grade tennis racket',
      price: 80,
      categories: [ProductCategory.SPORTS],
      location: 'Chicago',
      isNegotiable: false,
      owner: goldUser, // Gold user (can list up to 3 products)
      viewCount: 0,
    },
    {
      name: 'Baseball Glove',
      description: 'Leather baseball glove for all players',
      price: 60,
      categories: [ProductCategory.SPORTS],
      location: 'Houston',
      isNegotiable: true,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },
    {
      name: 'Basketball',
      description: 'High-quality basketball for professional use',
      price: 40,
      categories: [ProductCategory.SPORTS],
      location: 'Los Angeles',
      isNegotiable: false,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },
    {
      name: 'Yoga Mat',
      description: 'Eco-friendly yoga mat for fitness',
      price: 25,
      categories: [ProductCategory.SPORTS, ProductCategory.FITNESS],
      location: 'Miami',
      isNegotiable: true,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },

    // Additional Products (Filling up to 100 items)
    {
      name: 'Guitar',
      description: 'Acoustic guitar for beginners',
      price: 150,
      categories: [ProductCategory.MUSIC],
      location: 'Austin',
      isNegotiable: true,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },
    {
      name: 'Electric Keyboard',
      description: 'Portable electric keyboard for musicians',
      price: 200,
      categories: [ProductCategory.MUSIC],
      location: 'Orlando',
      isNegotiable: false,
      owner: platinumUser, // Platinum user (unlimited products)
      viewCount: 0,
    },
    // Continue repeating the pattern for more products...
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
  entities: [User, Product],
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
