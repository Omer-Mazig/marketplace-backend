import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// development only

@Injectable()
export class DelayMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        next();
      }, 500);
    } else {
      next();
    }
  }
}
