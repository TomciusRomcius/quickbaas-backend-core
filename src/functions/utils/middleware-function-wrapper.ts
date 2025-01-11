import SandboxedFunction from 'src/common/utils/sandboxedFunction';
import { RunsOnType } from '../server-middleware/utils/runs-on-type';
import { Request, Response } from 'express';

export class MiddlewareFunctionWrapper {
  private name: string;
  private sandboxedFunction: SandboxedFunction;
  private runsOn: RunsOnType;

  constructor(name: string, fn: SandboxedFunction, runsOn: RunsOnType) {
    this.sandboxedFunction = fn;
    this.runsOn = runsOn;
  }

  // Environment: database or auth
  tryRun(
    req: Request,
    res: Response,
    environment: string,
    additionalContext?: {},
  ) {
    if (
      (environment === 'database' && this.runsOn.database === true) ||
      (environment === 'auth' && this.runsOn.auth === true)
    ) {
      this.sandboxedFunction.run({ req, res, ...additionalContext });
    }
  }

  getName() {
    return this.name;
  }

  getSandboxedFunction() {
    return this.sandboxedFunction;
  }

  setSandboxedFunction(fn: SandboxedFunction) {
    this.sandboxedFunction = fn;
  }
}
