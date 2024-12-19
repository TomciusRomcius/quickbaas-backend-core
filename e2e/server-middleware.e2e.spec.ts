import ServerMiddleware from 'src/common/models/serverMiddlewareModel';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';
import { connectToTestDbs, wipeTestDbs } from './utils';

describe('Server middleware with database-client test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await connectToTestDbs();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    await wipeTestDbs();
  });

  it('should succesfully create middleware', async () => {
    const payload = {
      name: 'middlewaretest',
      code: 'console.log("test")',
      runsOn: {
        database: true,
        auth: true,
      },
    };
    const res = await request(app.getHttpServer())
      .post('/server-middleware/create')
      .send(payload);
    expect(res.status).toBe(201);
    const retrieved = await ServerMiddleware.findOne({ name: payload.name });
    expect(retrieved).toBeTruthy();
    expect(retrieved.name).toBe(payload.name);
    expect(retrieved.code).toBe(payload.code);
  });

  it('should run the middleware on a database call', async () => {
    const payload = {
      name: 'middlewaretest',
      code: 'res.status(400).json("custom"); cancelRequest()',
      runsOn: {
        database: true,
        auth: true,
      },
    };

    const dbPayload = {
      path: 'users',
    };
    await request(app.getHttpServer())
      .post('/server-middleware/create')
      .send(payload);

    const res = await request(app.getHttpServer())
      .post('/database-client/get')
      .send(dbPayload);
    expect(res.status).toBe(400);
    expect(res.body).toBe('custom');
  });
});
