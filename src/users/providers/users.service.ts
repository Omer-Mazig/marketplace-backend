import { Injectable } from '@nestjs/common';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { UserFinderProvider } from './user-finder.provider';
import { UserCreationProvider } from './user-creation.provider';

@Injectable()
export class UsersService {
  constructor(
    private readonly userFinderProvider: UserFinderProvider,
    private readonly userCreationProvider: UserCreationProvider,
  ) {}

  async getActiveUser(activeUser: ActiveUserData) {
    return this.userFinderProvider.findOneById(activeUser.sub);
  }

  async getActiveUserData(id: number) {
    return this.userFinderProvider.findOneWithRelations(id);
  }

  async createUser(createUserDto) {
    return this.userCreationProvider.createUser(createUserDto);
  }
}
