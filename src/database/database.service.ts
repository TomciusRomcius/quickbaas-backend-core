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
    if (urls) {
      (urls as string).split(' ').forEach((url) => {
        const connect = mongoose.connect(url);
        pendingConnections.push(connect);
      });
    }

    await Promise.all(pendingConnections);
  }
}
