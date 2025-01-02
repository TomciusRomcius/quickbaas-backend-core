import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import JWT from './jwt';

export const UserCookie = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Request;
    console.log(JSON.stringify(req.cookies));
    if (!req.cookies?.user) {
      return null;
    } else {
      const jwt = JWT.verify(req.cookies.user);
      return jwt;
    }
  },
);
