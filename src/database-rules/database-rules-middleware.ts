import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DatabaseRulesService } from './database-rules.service';

@Injectable()
export class DatabaseRulesMiddleware implements NestMiddleware {
  constructor(private databaseRulesService: DatabaseRulesService) {}

  async use(req: Request, res: Response, next: (error?: Error | any) => void) {
    // Check if the user is trying to do a write or read operation
    let operation: 'read' | 'write' | null = null;
    if (req.url.includes('database-client/get')) {
      operation = 'read';
    } else if (req.url.includes('database-client/set')) {
      operation = 'write';
    }

    if (operation === null) {
      // Should never happen
      Logger.error(
        'Database rules middleware was used on not a database client controller',
      );
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
