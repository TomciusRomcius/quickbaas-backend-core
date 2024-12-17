import { Injectable } from '@nestjs/common';
import { SetDatabaseRulesDto } from './dtos/setDatabaseRulesDto';
import DatabaseRules from 'src/common/models/database-rules-model';
import SandboxedFunction from 'src/common/utils/sandboxedFunction';
import { Request } from 'express';

// TODO: use only Redis for database rules
// TODO implement database updating across multiple backends

@Injectable()
export class DatabaseRulesService {
  databaseRules: unknown;

  async onModuleInit() {
    await this.loadDbRules();
  }

  public async getDatabaseRules(): Promise<unknown> {
    return (await DatabaseRules.findOne()).toObject();
  }
  public async setDatabaseRules(
    setDatabaseRulesDto: SetDatabaseRulesDto,
  ): Promise<void> {
    await DatabaseRules.deleteMany();
    if (setDatabaseRulesDto.rules !== undefined) {
      await DatabaseRules.create(setDatabaseRulesDto.rules);
    }
  }

  public async validateQuery(
    req: Request,
    path: string,
    operation: 'read' | 'write',
  ): Promise<boolean> {
    await this.loadDbRules();
    if (!this.databaseRules) return true;

    const pathParts = path.split('.');

    let ref = this.databaseRules;
    for (let pathPart of pathParts) {
      if (!ref) continue;
      ref = ref[pathPart];
    }

    const context = {
      fnResult: false,
      req: req,
    };

    if (operation === 'write') {
      const writeRef = ref['.write'];
      if (writeRef === false) return false;
      else if (typeof writeRef == 'string') {
        const fn = new SandboxedFunction(`fnResult = ${writeRef}`);
        fn.run(context);
        return context.fnResult;
      } else return true;
    } else if (operation === 'read') {
      const readRef = ref['.read'];
      if (readRef === false) return false;
      else if (typeof readRef == 'string') {
        const fn = new SandboxedFunction(`fnResult = ${readRef}`);
        fn.run(context);
        return context.fnResult;
      } else return true;
    }
  }

  private async loadDbRules() {
    this.databaseRules = (await DatabaseRules.findOne())?.toObject();
  }
}
