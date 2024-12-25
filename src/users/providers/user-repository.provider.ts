import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserRepositoryProvider {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findOneWithPassword(email: string) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async saveUser(user: User) {
    return await this.usersRepository.save(user);
  }

  createUser(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  async findOneWithRelations(id: number) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: { products: true, wishlist: true },
    });
  }
}
