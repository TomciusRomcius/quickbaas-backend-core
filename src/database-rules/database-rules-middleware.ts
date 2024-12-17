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
    // Check if the user is trying to do a write or read operation
    let operation: 'read' | 'write' | null = null;

    const pathname = new URL(
      `http://${process.env.HOST ?? 'localhost'}${req.url}`,
    ).pathname;

    if (pathname === '/database-client/get/') {
      operation = 'read';
    } else if (
      pathname === '/database-client/set/' ||
      pathname === '/database-client/push/'
    ) {
      operation = 'write';
    }

    if (operation === null) {
      throw new InternalServerErrorException();
    }

    // Process the request and check if database rules allow the request
    const canProceed = await this.databaseRulesService.validateQuery(
      req,
      req.body.path,
      operation,
    );

    if (canProceed) {
      next();
    } else {
      throw new UnauthorizedException('Not allowed');
    }
  }
}
