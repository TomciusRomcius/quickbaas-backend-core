import * as vm from 'node:vm';

export default class ServerFunction {
  name: string;
  userCode: string;
  context: {};

  constructor(name: string, userCode: string, context: {}) {
    this.name = name;
    this.userCode = userCode;
    this.context = context;
  }

  public run() {
    const script = new vm.Script(this.userCode);
    const contextifiedSandbox = vm.createContext(this.context);
    script.runInContext(contextifiedSandbox);
    return this.context['result'];
  }
}
