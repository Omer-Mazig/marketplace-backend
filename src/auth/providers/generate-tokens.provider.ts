import { Inject, Injectable } from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly JwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      // Access Token
      this._signToken<Partial<ActiveUserData>>(
        user.id,
        this.JwtConfiguration.accessTokenTtl,
        'access', // Specify token type as 'access'
        {
          email: user.email,
        },
      ),

      // Refresh Token
      this._signToken(
        user.id,
        this.JwtConfiguration.refreshTokenTtl,
        'refresh',
      ), // Specify token type as 'refresh'
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async _signToken<T>(
    userId: number,
    expiresIn: number,
    type: 'access' | 'refresh', // Add type parameter
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        type, // Include the token type in the payload
        ...payload,
      },
      {
        audience: this.JwtConfiguration.audience,
        issuer: this.JwtConfiguration.issuer,
        secret: this.JwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }
}
