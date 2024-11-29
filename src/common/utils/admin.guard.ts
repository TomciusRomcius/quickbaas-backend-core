import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.body.adminKey === process.env.ADMIN_KEY) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
