import { wipeTestDbs } from './utils';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

describe('E2E Database Client', () => {
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

  it('should be able to get and set data', async () => {
    const setBody = {
      path: 'app.name',
      value: 'App name',
    };
    const setRes = await request(app.getHttpServer())
      .post('/database-client/set')
      .send(setBody);

    expect(setRes.status).toBe(201);

    const getBody = {
      path: 'app.name',
    };

    const getRes = await request(app.getHttpServer())
      .post('/database-client/get')
      .send(getBody);

    expect(getRes.status).toBe(201);
    expect(getRes.body.result).toBe('App name');
  });

  it('should be able to push and get data', async () => {
    const pushBody = {
      path: 'app.list',
      value: 'List item',
    };
    const pushRes = await request(app.getHttpServer())
      .post('/database-client/push')
      .send(pushBody);

    expect(pushRes.status).toBe(201);
    const id = pushRes.body.id;
    expect(id).toBeTruthy();

    const getBody = {
      path: `app.list.${id}`,
    };

    const getRes = await request(app.getHttpServer())
      .post('/database-client/get')
      .send(getBody);

    expect(getRes.status).toBe(201);
    expect(getRes.body.result).toBe('List item');
  });
});
