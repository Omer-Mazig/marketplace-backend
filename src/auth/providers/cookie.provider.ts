import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieProvider {
  public setRefreshToken(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS
      sameSite: 'strict', // Protect against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 24 hours to match JWT_REFRESH_TOKEN_TTL
    });
  }

  public clearRefreshToken(res: Response): void {
    res.clearCookie('refreshToken');
  }
}
