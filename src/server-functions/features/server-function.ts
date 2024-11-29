import * as vm from 'node:vm';
import { Response, Request } from 'express';

export default class ServerFunction {
  name: string;
  userCode: string;
  context: {};

  constructor(name: string, userCode: string, context: {}) {
    this.name = name;
    this.userCode = userCode;
    this.context = context;
  }

  public run(req: Request, res: Response) {
    const script = new vm.Script(this.userCode);
    const contextifiedSandbox = vm.createContext({
      ...this.context,
      req: req,
      res: res,
    });
    script.runInContext(contextifiedSandbox);
  }
}
