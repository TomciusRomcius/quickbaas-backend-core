import { Injectable, Logger } from '@nestjs/common';
import { SetDatabaseRulesDto } from './dtos/setDatabaseRulesDto';
import DatabaseRules from 'src/common/models/database-rules-model';
import SandboxedFunction from 'src/common/utils/sandboxedFunction';
import { Request } from 'express';

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

  async onModuleInit() {
    this.databaseRules = await this.loadDbRules();
  }

  public async getDatabaseRules(): Promise<unknown> {
    this.databaseRules = await this.loadDbRules();
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
    operation: 'read' | 'write',
  ): Promise<boolean> {
    this.databaseRules = await this.loadDbRules();
    if (!this.databaseRules) {
      Logger.warn('Database rules are not defined!');
    }

    const path = req.body.path;
    const value = req.body.value;

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

    // TODO: just clean this up
    const ref = this.findTargetRuleAndFillContext(
      context,
      operation,
      path,
      value,
    );

    return this.processRule(ref, context);
  }

  private findTargetRuleAndFillContext(
    context: unknown,
    operation: string,
    path: string,
    value: unknown,
  ) {
    const pathParts = path.split('.');
    let workPath = new DatabasePath();

    let ref = this.databaseRules;
    let targetRule = this.databaseRules;

    // TODO: just clean this up
    for (let pathPart of pathParts) {
      if (!ref) break;
      targetRule = ref[`.${operation}`];
      if (!ref[pathPart]) {
        const ident = this.findIdentifier(ref);
        if (ident) {
          let key = ident.slice(1, ident.length);
          if (key) {
            context[key] = pathPart;
          }
          ref = ref[ident];
        } else ref = null;
      } else ref = ref[pathPart];

      workPath.append(pathPart);
    }

    ref =
      ref?.[`.${operation}`] === undefined
        ? targetRule
        : ref?.[`.${operation}`];

    return ref;
  }

  private processRule(rule: unknown, context: unknown) {
    if (rule === undefined) return false;
    if (typeof rule == 'string') {
      try {
        const fn = new SandboxedFunction(`fnResult = ${rule}`);
        fn.run(context);
      } catch {
        return false;
      }
      return context?.['fnResult'];
    } else if (typeof rule == 'boolean') {
      return rule;
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

  public async loadDbRules() {
    return (await DatabaseRules.findOne())?.toObject();
  }
}
