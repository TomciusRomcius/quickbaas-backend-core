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
    console.log(res.body.result);
    expect(res.body.result).toBe('App name');
  });
});
