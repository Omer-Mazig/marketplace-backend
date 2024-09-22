import 'tsconfig-paths/register'; // This should be at the top of your script

import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
import { UserTier } from 'src/users/enums/user-tier.enum';
import { ProductCategory } from 'src/products/enums/product-category.enum';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

const seed = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const productRepository = dataSource.getRepository(Product);

  // Password hashing for all users
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
  ];

  await userRepository.save(users);

  // Helper function to create a product
  const createProduct = (owner: User) => {
    return productRepository.create({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      stock: 1,
      imageURL: faker.image.url(),
      categories: [faker.helpers.arrayElement(Object.values(ProductCategory))],
      location: faker.location.city(),
      isNegotiable: faker.datatype.boolean(),
      owner,
    });
  };

  // Assign products to users based on their tier
  const products = [
    // Platinum user can have unlimited products, create 6 for example
    createProduct(users[0]),
    createProduct(users[0]),
    createProduct(users[0]),
    createProduct(users[0]),
    createProduct(users[0]),
    createProduct(users[0]),

    // Gold user can have up to 3 products
    createProduct(users[1]),
    createProduct(users[1]),
    createProduct(users[1]),

    // Standard user can only have 1 product
    createProduct(users[2]),
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
