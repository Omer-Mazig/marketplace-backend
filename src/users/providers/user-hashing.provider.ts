import { Injectable } from '@nestjs/common';
import { HashingProvider } from '../../auth/providers/hashing.provider';

@Injectable()
export class UserHashingProvider {
  constructor(private readonly hashingProvider: HashingProvider) {}

  async hashPassword(password: string): Promise<string> {
    return this.hashingProvider.hashPassword(password);
  }
}
