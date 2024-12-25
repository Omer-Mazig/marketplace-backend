import {
  Injectable,
  BadRequestException,
  RequestTimeoutException,
} from '@nestjs/common';
import { UserRepositoryProvider } from './user-repository.provider';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class UserCreationProvider {
  constructor(
    private readonly userRepository: UserRepositoryProvider,
    private readonly hashingProvider: HashingProvider,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOneByEmail(
        createUserDto.email,
      );
      if (existingUser) {
        throw new BadRequestException(
          'The user already exists, please check your email.',
        );
      }

      const hashedPassword = await this.hashingProvider.hashPassword(
        createUserDto.password,
      );
      const newUser = this.userRepository.createUser({
        ...createUserDto,
        password: hashedPassword,
      });

      return await this.userRepository.saveUser(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
      );
    }
  }
}
