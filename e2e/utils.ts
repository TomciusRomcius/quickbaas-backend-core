import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function wipeTestDbs(app: INestApplication) {
  const res = await request(app.getHttpServer()).post('/wipe-test-db').send({
    adminKey: 'secret',
  });
  if (!(res.status === 200 || res.status === 201)) {
    console.error(`Failed to delete test db \n 
                  Response status: ${res.status} \n
                  Response message: ${res.text}`);
  }
}
