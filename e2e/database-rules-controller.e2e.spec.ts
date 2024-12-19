import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import DatabaseRules from 'src/common/models/database-rules-model';
import * as request from 'supertest';
import { connectToTestDbs } from './utils';

describe('Database rules', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await connectToTestDbs();
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await DatabaseRules.deleteMany();
  });

  it('should be able to add and remove database rules', async () => {
    const databaseRules = {
      app: {
        write: false,
        read: true,
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
    expect(getRes.body?.app?.write).toBe(false);
    expect(getRes.body?.app?.read).toBe(true);

    const delRes = await request(app.getHttpServer())
      .post('/database-rules/set')
      .send({
        adminKey: process.env.ADMIN_KEY,
      });

    expect(delRes.status).toBe(201);

    const getRes2 = await request(app.getHttpServer())
      .post('/database-rules/get')
      .send({
        adminKey: process.env.ADMIN_KEY,
      });

    expect(getRes2.status).toBe(201);
    expect(getRes2.body).toMatchObject({});
  });
});
