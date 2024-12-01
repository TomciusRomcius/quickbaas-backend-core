import { RunsOnType } from '../server-middleware/utils/runs-on-type';
import ServerFunction from './server-function';
import { Request, Response } from 'express';

export class MiddlewareFunctionWrapper {
  private serverFunction: ServerFunction;
  private runsOn: RunsOnType;

  constructor(serverFunction: ServerFunction, runsOn: RunsOnType) {
    this.serverFunction = serverFunction;
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
      this.serverFunction.run(req, res, additionalContext);
    }
  }
}
