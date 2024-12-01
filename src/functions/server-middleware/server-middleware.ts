import { Injectable, NestMiddleware } from '@nestjs/common';
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
    await this.serverMiddlewareService.getAllMiddleware();
    console.log(this.serverMiddlewareService.middlewares.length);

    let shouldCancelRequest = false;

    const cancelRequest = () => (shouldCancelRequest = true);

    this.serverMiddlewareService.middlewares.forEach((middleware) => {
      middleware.tryRun(req, res, 'database', { cancelRequest: cancelRequest });
    });

    if (shouldCancelRequest) {
      return res.send();
    } else next();
  }
}
