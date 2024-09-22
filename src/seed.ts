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
      firstName: 'Platinum',
      lastName: 'User',
      email: 'platinum@gmail.com',
      password: hashedPassword,
      userTier: UserTier.PLATINUM,
    }),
    userRepository.create({
      firstName: 'Gold',
      lastName: 'User',
      email: 'gold@gmail.com',
      password: hashedPassword,
      userTier: UserTier.GOLD,
    }),
    userRepository.create({
      firstName: 'Standard',
      lastName: 'User',
      email: 'standard@gmail.com',
      password: hashedPassword,
      userTier: UserTier.STANDARD,
    }),
    userRepository.create({
      firstName: 'Gold',
      lastName: 'User Two',
      email: 'gold2@gmail.com',
      password: hashedPassword,
      userTier: UserTier.GOLD,
    }),
    userRepository.create({
      firstName: 'Gold',
      lastName: 'User Three',
      email: 'gold3@gmail.com',
      password: hashedPassword,
      userTier: UserTier.GOLD,
    }),
  ];

  await userRepository.save(users);

  // Define hard-coded products
  const products = [
    {
      name: 'Laptop',
      description: 'High-end gaming laptop',
      price: 1500,
      categories: [ProductCategory.ELECTRONICS, ProductCategory.GAMING],
      location: 'New York',
      isNegotiable: true,
      owner: users[0],
    },
    {
      name: 'Smartphone',
      description: 'Latest model smartphone',
      price: 999,
      categories: [ProductCategory.MOBILE_PHONES],
      location: 'San Francisco',
      isNegotiable: false,
      owner: users[0],
    },
    {
      name: 'Sports Watch',
      description: '',
      price: 200,
      categories: [ProductCategory.FITNESS, ProductCategory.WATCHES],
      location: 'Miami',
      isNegotiable: true,
      owner: users[0],
    },
    {
      name: 'Gaming Chair',
      description: 'Ergonomic gaming chair',
      price: 350,
      categories: [ProductCategory.FURNITURE, ProductCategory.GAMING],
      location: 'Los Angeles',
      isNegotiable: false,
      owner: users[1],
    },
    {
      name: 'Headphones',
      description: '',
      price: 120,
      categories: [ProductCategory.AUDIO],
      location: 'Seattle',
      isNegotiable: false,
      owner: users[1],
    },
    {
      name: 'Tennis Racket',
      description: 'Professional-grade tennis racket',
      price: 80,
      categories: [ProductCategory.SPORTS, ProductCategory.FITNESS],
      location: 'Chicago',
      isNegotiable: true,
      owner: users[1],
    },
    {
      name: 'Mountain Bike',
      description: 'Durable mountain bike',
      price: 550,
      categories: [ProductCategory.CYCLING],
      location: 'Denver',
      isNegotiable: true,
      owner: users[2],
    },
    {
      name: 'Guitar',
      description: 'Acoustic guitar',
      price: 300,
      categories: [ProductCategory.MUSIC, ProductCategory.INSTRUMENTS],
      location: 'Austin',
      isNegotiable: false,
      owner: users[2],
    },
    {
      name: 'Running Shoes',
      description: 'Lightweight running shoes',
      price: 120,
      categories: [ProductCategory.SHOES, ProductCategory.FITNESS],
      location: 'Boston',
      isNegotiable: true,
      owner: users[0],
    },
    {
      name: 'Office Chair',
      description: '',
      price: 180,
      categories: [ProductCategory.FURNITURE, ProductCategory.OFFICE_FURNITURE],
      location: 'Dallas',
      isNegotiable: false,
      owner: users[1],
    },
    {
      name: 'Gaming Console',
      description: 'Next-gen gaming console',
      price: 499,
      categories: [ProductCategory.VIDEO_GAMES, ProductCategory.ELECTRONICS],
      location: 'Houston',
      isNegotiable: false,
      owner: users[1],
    },
    {
      name: 'Leather Jacket',
      description: '',
      price: 250,
      categories: [ProductCategory.FASHION, ProductCategory.CLOTHING],
      location: 'Las Vegas',
      isNegotiable: true,
      owner: users[2],
    },
    {
      name: 'Yoga Mat',
      description: 'Eco-friendly yoga mat',
      price: 50,
      categories: [ProductCategory.FITNESS, ProductCategory.HEALTH],
      location: 'Portland',
      isNegotiable: true,
      owner: users[0],
    },
    {
      name: 'Camera',
      description: 'Professional camera',
      price: 900,
      categories: [ProductCategory.PHOTOGRAPHY, ProductCategory.CAMERAS],
      location: 'Nashville',
      isNegotiable: false,
      owner: users[1],
    },
    {
      name: 'Electric Scooter',
      description: 'Foldable electric scooter',
      price: 400,
      categories: [ProductCategory.OUTDOORS],
      location: 'San Diego',
      isNegotiable: true,
      owner: users[2],
    },
    {
      name: 'Cookware Set',
      description: '',
      price: 200,
      categories: [ProductCategory.KITCHEN, ProductCategory.HOME],
      location: 'Phoenix',
      isNegotiable: true,
      owner: users[0],
    },
    {
      name: 'Fitness Tracker',
      description: 'Waterproof fitness tracker',
      price: 150,
      categories: [ProductCategory.FITNESS],
      location: 'Orlando',
      isNegotiable: false,
      owner: users[1],
    },
    {
      name: 'Office Desk',
      description: 'Spacious office desk',
      price: 350,
      categories: [ProductCategory.OFFICE_SUPPLIES, ProductCategory.FURNITURE],
      location: 'Tampa',
      isNegotiable: false,
      owner: users[2],
    },
    {
      name: 'Bluetooth Speaker',
      description: 'Portable Bluetooth speaker',
      price: 70,
      categories: [ProductCategory.AUDIO],
      location: 'Salt Lake City',
      isNegotiable: true,
      owner: users[0],
    },
    {
      name: 'Book Collection',
      description: 'Complete works of Shakespeare',
      price: 100,
      categories: [ProductCategory.BOOKS, ProductCategory.ART],
      location: 'Philadelphia',
      isNegotiable: false,
      owner: users[1],
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
