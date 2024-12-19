import ClientSpaceModel from 'src/common/models/client-space-model';
import { connectToTestDbs, wipeTestDbs } from './utils';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import DatabaseRules from 'src/common/models/database-rules-model';

describe('E2E Database Client', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    await app.init();
    await connectToTestDbs();
    await wipeTestDbs();
    await DatabaseRules.create({
      app: {
        '.write': true,
        '.read': true,
      },
    });
  });

  it('should be able to get data', async () => {
    await ClientSpaceModel.create({
      app: {
        name: 'App name',
      },
    });

    const body = {
      path: 'app.name',
    };

    const res = await request(app.getHttpServer())
      .post('/database-client/get')
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body.result).toBe('App name');
  });

  it('should be able to set data', async () => {
    const body = {
      path: 'app.name',
      value: 'App name',
    };
    const setRes = await request(app.getHttpServer())
      .post('/database-client/set')
      .send(body);

    expect(setRes.status).toBe(201);

    const document = await ClientSpaceModel.findOne();
    expect(document.get(body.path)).toBe('App name');
  });

  it('should be able to push data', async () => {
    const body = {
      path: 'app.list',
      value: 'List item',
    };
    const pushRes = await request(app.getHttpServer())
      .post('/database-client/push')
      .send(body);

    expect(pushRes.status).toBe(201);

    const document = await ClientSpaceModel.findOne();

    const ref = document.get(body.path);
    let retrievedValue;
    for (let key in ref) {
      retrievedValue = ref[key];
    }

    expect(retrievedValue).toBe('List item');
  });
});
