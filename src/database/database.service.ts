import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }
  public async connect() {
    let urls = this.configService.get('DATABASE_URLS');
    const pendingConnections = [];
    if (urls) {
      (urls as string).split(' ').forEach((url) => {
        const connect = mongoose.connect(url);
        pendingConnections.push(connect);
      });
    }

    await Promise.all(pendingConnections);
  }

  public async deleteTestDbs() {
    if (process.env.NODE_ENV === 'production') {
      throw new NotFoundException();
    }

    if (
      !(
        mongoose.connection.db.databaseName === 'test' ||
        mongoose.connection.db.databaseName === 'development'
      )
    ) {
      throw new ForbiddenException(
        'You are trying to wipe not a development or test database',
      );
    }
    const collectionNames = (
      await mongoose.connection.db.listCollections().toArray()
    ).map((col) => col.name);
    let deletions = [];
    for (const name of collectionNames) {
      const deletion = async () => {
        console.log(`Deleting ${name}`);
        const col = mongoose.connection.db.collection(name);
        await col.deleteMany();
      };
      deletions.push(deletion());
    }
    await Promise.all(deletions);
  }
}
