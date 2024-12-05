import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

// TODO: decide waht to use: findOne or findOneBy
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async getActiveUser(activeUser: ActiveUserData) {
    return await this.findOneById(activeUser.sub);
  }

  public async getActiveUserData(id: number) {
    let user: User | null = null;

    try {
      user = await this.usersRepository.findOne({
        where: { id },
        relations: {
          products: true,
          wishlist: true,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!user) {
      throw new BadRequestException('The user ID does not exist');
    }

    return user;
  }

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;

    try {
      // Check if a user already exists with the same email
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      // Handle errors related to database connectivity
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // If a user with the same email exists, throw an exception
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.',
      );
    }

    // Create a new user with hashed password
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      // Save the new user to the database
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      // Handle errors related to database saving
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // Return the newly created user
    return newUser;
  }

  public async findOneById(id: number) {
    let user: User | null = null;

    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!user) {
      throw new BadRequestException('The user ID does not exist');
    }

    return user;
  }

  public async findOneByEmail(email: string) {
    let user: User | null = null;

    try {
      user = await this.usersRepository.findOneBy({
        email: email,
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    return user;
  }

  public async findOneByEmailWithPassword(email: string) {
    let userWithPassword: User | null = null;

    try {
      userWithPassword = await this.usersRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne();
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    if (!userWithPassword) {
      throw new UnauthorizedException('User does not exists');
    }

    return userWithPassword;
  }
}
