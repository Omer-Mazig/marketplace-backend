import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

import { Response } from 'express'; // Import Response type from express

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly signInProvider: SignInProvider,
    private readonly refreshTokensProvder: RefreshTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto, res: Response) {
    const { accessToken, refreshToken } =
      await this.signInProvider.signIn(signInDto);

    // Set the refresh token in an httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS
      sameSite: 'strict', // Protect against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 24 hours to match JWT_REFRESH_TOKEN_TTL
    });

    // Send the access token in the response body
    return { accessToken };
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvder.refreshTokens(refreshTokenDto);
  }
}
