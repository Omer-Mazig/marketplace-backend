import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { UserFinderProvider } from 'src/users/providers/user-finder.provider';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly generateTokensProvider: GenerateTokensProvider,
    private readonly userFinderProvider: UserFinderProvider,
    @Inject(jwtConfig.KEY)
    private readonly JwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  // TODO: handle error better
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // Verify the refresh token
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.JwtConfiguration.secret,
        audience: this.JwtConfiguration.audience,
        issuer: this.JwtConfiguration.issuer,
      });

      // Fetch user from database
      const user = await this.userFinderProvider.findOneById(sub);

      // Generate the tokens
      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
