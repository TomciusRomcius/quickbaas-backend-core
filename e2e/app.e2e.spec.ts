import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    process.env.API_KEY = 'api-key';
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .send({
        apiKey: process.env.API_KEY,
      })
      .expect(200)
      .expect('Hello World!');
  });

  it('should give an unauthorized http code if the api key was not provided but it was defined in the .env file', async () => {
    const res = await request(app.getHttpServer()).get('/');
    expect(res.status).toBe(401);
  });
});
