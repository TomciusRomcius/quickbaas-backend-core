import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import mongoose from 'mongoose';
import { AdminGuard } from './common/utils/admin.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('Hello test');
    return this.appService.getHello();
  }

  @Post('wipe-test-db')
  @UseGuards(AdminGuard)
  async wipeTestDb() {
    if (process.env.NODE_ENV === 'production') return;
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
