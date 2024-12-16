import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { AppModule } from 'src/app.module';
import ServerMiddleware from 'src/common/models/serverMiddlewareModel';
import * as request from 'supertest';

describe('Database rules', () => {
  let app: INestApplication;

  beforeEach(async () => {
    await mongoose.connect(process.env.DATABASE_URLS);
    await ServerMiddleware.deleteMany();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('should work with simple rulkes', async () => {
    const payload = {
      path: 'app.name',
      value: 'Sicko',
    };

    const res = await request(app.getHttpServer())
      .POST('/database-client/set')
      .send(payload);
    expect(res.status).toBe(201);
  });
});
