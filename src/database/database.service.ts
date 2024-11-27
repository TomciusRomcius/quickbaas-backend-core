import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class DatabaseService {
  async onModuleInit() {
    await this.connect();
  }
  public async connect() {
    await mongoose.connect('mongodb://root:rootpassword@127.0.0.1:27017');
  }
}
