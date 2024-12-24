import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UserFinderProvider } from 'src/users/providers/user-finder.provider';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
    private readonly userFinderProvider: UserFinderProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    const userWithPassword =
      await this.userFinderProvider.findOneByEmailWithPassword(signInDto.email);

    let isEqual = false;

    try {
      // TODO: check how do we call abstract class
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        userWithPassword.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect Password');
    }

    return await this.generateTokensProvider.generateTokens(userWithPassword);
  }
}
