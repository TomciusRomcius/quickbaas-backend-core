import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { connectToTestDbs } from './utils';
import DatabaseRules from 'src/common/models/database-rules-model';

const databaseRules = {
  app: {
    name: {
      ['.write']: false,
      ['.read']: true,
    },
  },
};

describe('Database rules middleware', () => {
  let app: INestApplication;
  beforeEach(async () => {
    await connectToTestDbs();
    await DatabaseRules.deleteMany();
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`should not run database queries if database rules don't allow it`, async () => {
    await DatabaseRules.create(databaseRules);

    const setPayload = {
      path: 'app.name',
      value: 'new value',
    };
    const getPayload = {
      path: 'app.name',
    };

    const setRes = await request(app.getHttpServer())
      .post('/database-client/set')
      .send(setPayload);

    expect(setRes.status).toBe(401);

    const getRes2 = await request(app.getHttpServer())
      .post('/database-client/get')
      .send(getPayload);

    expect(getRes2.status).toBe(201);
  });
});
