import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.cookies?.user) {
      try {
        req.cookies.user = this.jwtService.verify(req.cookies.user);
      } catch {
        req.cookies.user = null;
        res.clearCookie('user');
      }
    }

    next();
  }
}
