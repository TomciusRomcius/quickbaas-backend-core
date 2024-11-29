import * as vm from 'node:vm';

export default class ServerFunction {
  name: string;
  userCode: string;

  constructor(name: string, userCode: string) {
    this.name = name;
    this.userCode = userCode;
  }

  public run() {
    const sandbox = { result: null, message: '' };
    const script = new vm.Script(this.userCode);
    const contextifiedSandbox = vm.createContext(sandbox);
    script.runInContext(contextifiedSandbox);
    return sandbox.result;
  }
}
