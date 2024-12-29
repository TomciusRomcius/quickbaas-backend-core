import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { wipeTestDbs } from './utils';

describe('Database rules middleware', () => {
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

  it('should set initial db data', async () => {
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

    const res = await request(app.getHttpServer())
      .post('/database-client/set')
      .send({ path: '', value: dbData });

    expect(res.status).toBe(201);
  });

  it('should be able to add database rules', async () => {
    const databaseRules = {
      users: {
        '.write': true,
        '.read': true,
        '#uid': {
          '.write': '(req.body.uid == uid)',
          '.read': true,
        },
      },
      app: {
        name: {
          ['.write']: false,
          ['.read']: true,
        },
      },
    };

    const setRes = await request(app.getHttpServer())
      .post('/database-rules/set')
      .send({
        rules: databaseRules,
        adminKey: process.env.ADMIN_KEY,
      });

    expect(setRes.status).toBe(201);

    const getRes = await request(app.getHttpServer())
      .post('/database-rules/get')
      .send({
        adminKey: process.env.ADMIN_KEY,
      });

    expect(getRes.status).toBe(201);
    expect(JSON.stringify(getRes.body)).toBe(JSON.stringify(databaseRules));
  });

  it(`should handle simple authorization on database queries`, async () => {
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

    const getRes = await request(app.getHttpServer())
      .post('/database-client/get')
      .send(getPayload);

    expect(getRes.status).toBe(201);
  });

  it('should work with forEach identifier #', async () => {
    const setPayload1 = {
      path: 'users.user1.name',
      value: 'new value',
    };

    const setPayload2 = {
      path: 'users.user1.name',
      value: 'new value',
      uid: 'user1',
    };

    const setRes1 = await request(app.getHttpServer())
      .post('/database-client/set/')
      .send(setPayload1);

    const setRes2 = await request(app.getHttpServer())
      .post('/database-client/set/')
      .send(setPayload2);

    expect(setRes1.status).toBe(401);

    expect(setRes2.status).toBe(201);
  });

  it('should delete existing database rules', async () => {
    const delRes = await request(app.getHttpServer())
      .post('/database-rules/set')
      .send({
        adminKey: process.env.ADMIN_KEY,
      });

    expect(delRes.status).toBe(201);

    const getRes = await request(app.getHttpServer())
      .post('/database-rules/get')
      .send({
        adminKey: process.env.ADMIN_KEY,
      });

    expect(JSON.stringify(getRes.body)).toBe('{}');
  });
});
