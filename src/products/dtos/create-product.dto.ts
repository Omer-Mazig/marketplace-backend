import { Category } from 'src/categories/category.entity';
import { Message } from 'src/messages/message.entity';
import { User } from 'src/users/user.entity';

export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  imageURL?: string;
  owner: User;
  categories: Category[];
  wishlistUsers: User[];
  messages: Message[];
}
