import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigurration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this._extractRequestFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfigurration.secret,
        audience: this.jwtConfigurration.audience,
        issuer: this.jwtConfigurration.issuer,
      });

      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      request[REQUEST_USER_KEY] = payload;
      return true;
    } catch (error) {
      // Re-throw the original error if it's an instance of UnauthorizedException
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Otherwise, throw a general UnauthorizedException
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private _extractRequestFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
