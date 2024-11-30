import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ServerMiddlewareService } from './server-middleware.service';
import { DatabaseClientOperationService } from 'src/database-client-operation/database-client-operation.service';

@Injectable()
export class ServerMiddleware implements NestMiddleware {
  constructor(
    private serverMiddlewareService: ServerMiddlewareService,
    private databaseClientService: DatabaseClientOperationService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // throw new UnauthorizedException('unauthorized');
    await this.serverMiddlewareService.getAllMiddleware();
    console.log(this.serverMiddlewareService.middlewares.length);
    this.serverMiddlewareService.middlewares.forEach((middleware) => {
      middleware.tryRun(req, res, 'database');
    });
    next();
  }
}
