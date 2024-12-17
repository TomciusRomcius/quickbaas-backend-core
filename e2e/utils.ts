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
