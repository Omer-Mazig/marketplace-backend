import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';
import { AuthService } from './providers/auth.service';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

import { Response, Request } from 'express'; // Use Request and Response from express

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { accessToken } = await this.authService.signIn(signInDto, res);
    res.json({ accessToken });
  }

  @Auth(AuthType.None)
  @Post('refresh-token')
  public async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    console.log('refreshAccessToken --- ', refreshToken);

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshTokens({ refreshToken }); // ?

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours to match JWT_REFRESH_TOKEN_TTL
      });

      // Return the new access token
      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
