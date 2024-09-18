import { Inject, Injectable } from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    /**
     * Inject JwtService
     */
    private readonly jwtService: JwtService,
    /**
     * Inject JwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly JwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(
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

  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      // Access Token
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.JwtConfiguration.accessTokenTtl,
        'access', // Specify token type as 'access'
        {
          email: user.email,
        },
      ),

      // Refresh Token
      this.signToken(user.id, this.JwtConfiguration.refreshTokenTtl, 'refresh'), // Specify token type as 'refresh'
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
