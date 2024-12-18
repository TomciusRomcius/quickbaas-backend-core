import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DatabaseRulesService } from './database-rules.service';

@Injectable()
export class DatabaseRulesMiddleware implements NestMiddleware {
  constructor(private readonly databaseRulesService: DatabaseRulesService) {}

  async use(req: Request, res: Response, next: (error?: Error | any) => void) {
    const operation = this.getOperation(req);

    if (operation === null) {
      throw new InternalServerErrorException('Invalid URL');
    }

    const canProceed = await this.databaseRulesService.validateQuery(
      req,
      operation,
    );

    if (canProceed) {
      next();
    } else {
      throw new UnauthorizedException('Not allowed');
    }
  }

  private getOperation(req: Request) {
    let operation: 'read' | 'write' | null = null;

    const fullUrl = `http://${process.env.HOST ?? 'localhost'}${req.url}`;
    const parsedUrl = new URL(fullUrl);
    let pathname = parsedUrl.pathname;
    if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);

    if (pathname === '/database-client/get') {
      operation = 'read';
    } else if (
      pathname === '/database-client/set' ||
      pathname === '/database-client/push'
    ) {
      operation = 'write';
    }

    return operation;
  }
}
