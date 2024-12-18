import * as vm from 'node:vm';
import { Request, Response, NextFunction } from 'express';

// TODO: make it a wrapper of SandboxedFunction
export default class ServerFunction {
  name: string;
  userCode: string;
  script: vm.Script;
  context: {};

  constructor(name: string, userCode: string, context: {}) {
    this.name = name;
    this.userCode = userCode;
    this.context = context;
    this.script = new vm.Script(this.userCode);
  }

  public run(req: Request, res: Response, additionalContext?: {}) {
    const contextifiedSandbox = vm.createContext({
      ...this.context,
      req: req,
      res: res,
      ...additionalContext,
    });
    this.script.runInContext(contextifiedSandbox);
  }
}
