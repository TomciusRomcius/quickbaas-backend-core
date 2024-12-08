import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { SetDatabaseRulesDto } from './dtos/setDatabaseRulesDto';
import DatabaseRules from 'src/common/models/database-rules-model';

// TODO: use only Redis for database rules

@Injectable()
export class DatabaseRulesService {
  public async getDatabaseRules(): Promise<string> {
    return 'Not implemented';
  }
  public async setDatabaseRules(
    setDatabaseRulesDto: SetDatabaseRulesDto,
  ): Promise<void> {}
  public async validateQuery(
    dbRules: unknown,
    path: string,
    operation: 'read' | 'write',
  ): Promise<boolean> {
    const pathParts = path.split('.');

    let ref = dbRules;
    for (let pathPart of pathParts) {
      if (!ref) continue;
      ref = ref[pathPart];
    }

    console.log(dbRules);

    if (operation === 'write') {
      if (ref['.write'] === undefined) return true;
      if (ref['.write'] === true) return true;
    } else if (operation === 'read') {
      if (ref['.read'] === undefined) return true;
      if (ref['.read'] === true) return true;
    }
  }
}

export class DatabaseRulesMiddleware implements NestMiddleware {
  constructor(private databaseRulesService: DatabaseRulesService) {}

  use(req: Request, res: Response, next: (error?: Error | any) => void) {
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

    // this.databaseRulesService.validateQuery(req.body.rules, operation);

    next();
  }
}
