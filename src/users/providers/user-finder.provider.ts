import {
  Injectable,
  BadRequestException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepositoryProvider } from './user-repository.provider';

@Injectable()
export class UserFinderProvider {
  constructor(private readonly userRepository: UserRepositoryProvider) {}

  async findOneById(id: number) {
    try {
      const user = await this.userRepository.findOneById(id);
      if (!user) {
        throw new BadRequestException('The user ID does not exist');
      }
      return user;
    } catch (error) {
      throw new RequestTimeoutException('Error connecting to the database');
    }
  }

  async findOneWithRelations(id: number) {
    try {
      const user = await this.userRepository.findOneWithRelations(id);
      if (!user) {
        throw new BadRequestException('The user ID does not exist');
      }
      return user;
    } catch (error) {
      throw new RequestTimeoutException('Error connecting to the database');
    }
  }

  async findOneByEmailWithPassword(email: string) {
    try {
      const user = await this.userRepository.findOneWithPassword(email);
      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }
      return user;
    } catch (error) {
      throw new RequestTimeoutException('Could not fetch the user');
    }
  }
}
