import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/common/utils/admin.guard';
import { SetDatabaseRulesDto } from './dtos/setDatabaseRulesDto';
import { DatabaseRulesService } from './database-rules.service';

@Controller('database-rules')
export class DatabaseRulesController {
  constructor(private databaseRulesService: DatabaseRulesService) {}

  @UseGuards(AdminGuard)
  @Get('get')
  async getDatabaseRules() {}

  @UseGuards(AdminGuard)
  @Post('set')
  async setDatabaseRules(@Body() setDatabaseRulesDto: SetDatabaseRulesDto) {
    this.databaseRulesService.setDatabaseRules(setDatabaseRulesDto);
  }
}
