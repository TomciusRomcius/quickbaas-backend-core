import mongoose from 'mongoose';
import { GenericContainer } from 'testcontainers';

let container;

export async function connectToTestDbs() {
  container = await new GenericContainer('mongo')
    .withExposedPorts(27017)
    .start();

  const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;
  process.env.DATABASE_URLS = mongoUri;
}

// Can't be called before connectToTestDbs()
export async function wipeTestDbs() {
  const promises = [];

  mongoose.connections.forEach((connection) => {
    promises.push(connection.db.dropDatabase());
  });

  await Promise.all(promises);
}
