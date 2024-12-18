import mongoose from 'mongoose';

export async function connectToTestDbs() {
  if (process.env.DATABASE_URLS) {
    const promises = [];
    process.env.DATABASE_URLS.split(' ').forEach((url) => {
      promises.push(mongoose.connect(url));
    });

    await Promise.all(promises);
  } else {
    throw new Error('Test databases are not running!');
  }
}

// Can't be called before connectToTestDbs()
export async function wipeTestDbs() {
  const promises = [];

  mongoose.connections.forEach((connection) => {
    promises.push(connection.db.dropDatabase());
  });

  await Promise.all(promises);
}
