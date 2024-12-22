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
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { Response, Request } from 'express';
import { AuthService } from './providers/auth.service';
import { CookieProvider } from './providers/cookie.provider';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieProvider: CookieProvider,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { accessToken } = await this.authService.signIn(signInDto, res);
    res.json({ accessToken });
  }

  @Post('sign-out')
  @Auth(AuthType.None)
  public async signOut(@Req() req: Request, @Res() res: Response) {
    this.cookieProvider.clearRefreshToken(res);
    return res.json({ message: 'Logging out' });
  }

  @Auth(AuthType.None)
  @Post('refresh-token')
  public async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshTokens({ refreshToken });

      this.cookieProvider.setRefreshToken(res, newRefreshToken);

      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
