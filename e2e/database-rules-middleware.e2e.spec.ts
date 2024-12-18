import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { connectToTestDbs, wipeTestDbs } from './utils';
import DatabaseRules from 'src/common/models/database-rules-model';
import ClientSpaceModel from 'src/common/models/client-space-model';

describe('Database rules middleware', () => {
  let app: INestApplication;
  beforeEach(async () => {
    await connectToTestDbs();
    await wipeTestDbs();
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`should not run database queries if database rules don't allow it`, async () => {
    const databaseRules = {
      app: {
        name: {
          ['.write']: false,
          ['.read']: true,
        },
      },
    };

    const setPayload = {
      path: 'app.name',
      value: 'new value',
    };
    const getPayload = {
      path: 'app.name',
    };

    await DatabaseRules.create(databaseRules);

    const setRes = await request(app.getHttpServer())
      .post('/database-client/set')
      .send(setPayload);

    expect(setRes.status).toBe(401);

    const getRes2 = await request(app.getHttpServer())
      .post('/database-client/get')
      .send(getPayload);

    expect(getRes2.status).toBe(201);
  });

  it.only('should work with forEach identifier $', async () => {
    const dbData = {
      users: {
        user1: {
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        user2: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
        },
        user3: {
          name: 'Alice Johnson',
          email: 'alice.johnson@example.com',
        },
      },
    };

    const databaseRules = {
      users: {
        '.write': true,
        '.read': true,
        '#uid': {
          '.write': '(req.body.uid == uid)',
          '.read': true,
        },
      },
    };

    const setPayload1 = {
      path: 'users.user1.name',
      value: 'new value',
    };

    const setPayload2 = {
      path: 'users.user1.name',
      value: 'new value',
      uid: 'user1',
    };

    await ClientSpaceModel.create(dbData);
    await DatabaseRules.create(databaseRules);

    const setRes1 = await request(app.getHttpServer())
      .post('/database-client/set/')
      .send(setPayload1);

    const setRes2 = await request(app.getHttpServer())
      .post('/database-client/set/')
      .send(setPayload2);

    expect(setRes1.status).toBe(401);

    expect(setRes2.status).toBe(201);
  });
});
