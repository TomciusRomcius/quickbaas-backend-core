// @ts-nocheck

import ServerFunction from './server-function';

describe('ServerFunction', () => {
  const generateMockReqRes = (reqBody: unknown) => {
    const mockReq = {
      body: reqBody,
    } as Request;

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Response;

    return { mockReq: mockReq, mockRes: mockRes };
  };

  it('should be able to read req.body and send back a response', () => {
    const { mockReq, mockRes } = generateMockReqRes({ number: 5 });
    const code = `
      const body = req.body;
      res.status(200).json(body.number * 5);
    `;
    const fn = new ServerFunction('fn', code);
    fn.run(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(25);
  });

  it('should be able access additional context', () => {
    const { mockReq, mockRes } = generateMockReqRes({ number: 5 });

    const additionalContext = {
      messageFormula: () => 'abcd',
    };

    const code = `
      const body = req.body;
      res.status(200).json(messageFormula());
    `;

    const fn = new ServerFunction('fn', code);

    fn.run(mockReq, mockRes, additionalContext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith('abcd');
  });
});
