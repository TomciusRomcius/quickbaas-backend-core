import { Injectable, Logger } from '@nestjs/common';
import { SetDatabaseRulesDto } from './dtos/setDatabaseRulesDto';
import DatabaseRules from 'src/common/models/database-rules-model';
import SandboxedFunction from 'src/common/utils/sandboxedFunction';
import { Request } from 'express';
import { DatabaseClientOperationService } from 'src/database-client-operation/database-client-operation.service';

class DatabasePath {
  private readonly parts: string[] = [];

  public append(part: string): void {
    if (part) {
      this.parts.push(part);
    } else {
      Logger.warn('Trying to push an empty path!');
    }
  }

  public toString(): string {
    if (this.parts.length == 0) return '';

    let str = '';
    for (let i = 0; i < this.parts.length; i++) {
      if (i == this.parts.length - 1) {
        str += this.parts[i];
      } else {
        str += `${this.parts[i]}.`;
      }
    }

    return str;
  }
}

// TODO: use only Redis for database rules
// TODO implement database updating across multiple backends

@Injectable()
export class DatabaseRulesService {
  databaseRules: unknown;

  constructor(
    private readonly databaseClientOperationService: DatabaseClientOperationService,
  ) {}

  async onModuleInit() {
    await this.loadDbRules();
  }

  public async getDatabaseRules(): Promise<unknown> {
    await this.loadDbRules();
    return this.databaseRules;
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
    value: unknown,
    operation: 'read' | 'write',
  ): Promise<boolean> {
    await this.loadDbRules();
    if (!this.databaseRules) return true;

    if (!path) {
      return false;
    }

    let context = {
      fnResult: false,
      req: req,
      value: value,
    };

    const pathParts = path.split('.');
    let workPath = new DatabasePath();

    let ref = this.databaseRules;
    let targetRule = this.databaseRules;

    // TODO: just clean this up
    for (let pathPart of pathParts) {
      if (!ref) break;
      if (ref[`.${operation}`] !== undefined) {
        targetRule = ref[`.${operation}`];
      }
      if (ref[pathPart]) {
        const key = pathPart.slice(1, pathPart.length - 1);
        context[key] = ref;
        ref = ref[pathPart];
      } else if (!ref[pathPart]) {
        const ident = this.findIdentifier(ref);
        if (ident) {
          console.log(ident);
          let key = ident.slice(1, ident.length);
          if (key) {
            context[key] = pathPart;
          }
          ref = ref[ident];
        } else ref = null;
      }

      workPath.append(pathPart);
    }

    ref =
      ref?.[`.${operation}`] === undefined
        ? targetRule?.[`.${operation}`]
        : ref?.[`.${operation}`];

    if (ref === undefined) return false;

    if (typeof ref == 'string') {
      const fn = new SandboxedFunction(`fnResult = ${ref}`);
      fn.run(context);
      return context.fnResult;
    } else if (typeof ref == 'boolean') {
      return ref;
    } else return false;
  }

  private findIdentifier(obj: any) {
    for (const key in obj) {
      if (key.startsWith('#')) {
        return key;
      }
    }

    return null;
  }

  private async loadDbRules() {
    this.databaseRules = (await DatabaseRules.findOne())?.toObject();
  }
}
