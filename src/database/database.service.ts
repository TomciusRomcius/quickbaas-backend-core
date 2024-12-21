import { Injectable } from '@nestjs/common';
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
    const isWindows = (process.platform === 'win32') ? true : false;
    if (urls) {
      (urls as string).split(' ').forEach((url) => {
        if (isWindows) url.replace('mongo-db', '127.0.0.1');
        const connect = mongoose.connect(url);
        pendingConnections.push(connect);
      });
    }

    await Promise.all(pendingConnections);
  }
}
