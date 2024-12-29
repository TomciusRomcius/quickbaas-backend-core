import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminGuard } from './common/utils/admin.guard';
import { CachingService } from './caching/caching.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
    private readonly cachingService: CachingService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('wipe-test-db')
  @UseGuards(AdminGuard)
  async wipeTestDb() {
    if (process.env.NODE_ENV === 'production') return;
    const promises = [];
    promises.push(this.databaseService.deleteTestDbs());
    promises.push(this.cachingService.deleteTestCache());
    await Promise.all(promises);
  }
}
