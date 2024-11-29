import ServerFunction from './server-function';

describe('Server functions class', () => {
  it('should run code', () => {
    const userCode = `
    result = 7; // Uses the context-provided function
    `;

    const fn = new ServerFunction('name', userCode);
    const res = fn.run();
    expect(res).toBe(7);
  });
});
