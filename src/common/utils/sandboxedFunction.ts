import * as vm from 'node:vm';

export default class SandboxedFunction {
  userCode: string;
  script: vm.Script;
  context: {};

  constructor(userCode: string) {
    this.userCode = userCode;
    this.script = new vm.Script(this.userCode);
  }

  public run(context: unknown) {
    const contextifiedSandbox = vm.createContext(context);
    this.script.runInContext(contextifiedSandbox);
  }
}
