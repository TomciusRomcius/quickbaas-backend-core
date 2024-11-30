import ServerFunction from "./server-function";
import { Request, Response } from 'express';

export class MiddlewareFunctionWrapper {
  private serverFunction: ServerFunction;
  private runsOn: {}

  constructor(serverFunction: ServerFunction) {
    this.serverFunction = serverFunction;
  }

  // Environment: database or auth
  tryRun(req: Request, res: Response, environment: string) {
    this.serverFunction.run(req, res);
  }
}