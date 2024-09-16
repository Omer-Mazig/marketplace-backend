import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { MessagesModule } from './messages/messages.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import evniromentValidation from './config/evniroment.validation';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Message } from './messages/message.entity';
import { Category } from './categories/category.entity';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: evniromentValidation,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: configService.get('database.autoLoadEtities'),
        synchronize: configService.get('database.synchronize'),
        port: +configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        host: configService.get('database.host'),
        database: configService.get('database.name'),
      }),
    }),

    TypeOrmModule.forFeature([User, Product, Message, Category]),

    UsersModule,
    ProductsModule,
    CategoriesModule,
    MessagesModule,
  ],
})
export class AppModule {}
