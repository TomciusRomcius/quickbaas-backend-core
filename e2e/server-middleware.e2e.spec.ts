import ServerMiddleware from 'src/common/models/serverMiddlewareModel';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';
import { wipeTestDbs } from './utils';

describe('Server middleware with database-client test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    await wipeTestDbs(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should succesfully create middleware ', async () => {
    const payload = {
      name: 'middlewaretest',
      code: 'res.status(400).json("custom"); cancelRequest()',
      runsOn: {
        database: true,
        auth: true,
      },
    };

    const createRes = await request(app.getHttpServer())
      .post('/server-middleware/create')
      .send(payload);
    expect(createRes.status).toBe(201);
  });

  it('should run the middleware on a database call', async () => {
    const dbPayload = {
      path: 'users',
    };

    const res = await request(app.getHttpServer())
      .post('/database-client/get')
      .send(dbPayload);
    expect(res.status).toBe(400);
    expect(res.body).toBe('custom');
  });
});
