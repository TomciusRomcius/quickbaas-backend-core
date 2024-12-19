import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/common/utils/admin.guard';
import { SetDatabaseRulesDto } from './dtos/setDatabaseRulesDto';
import { DatabaseRulesService } from './database-rules.service';

@Controller('database-rules')
export class DatabaseRulesController {
  constructor(private readonly databaseRulesService: DatabaseRulesService) {}

  @UseGuards(AdminGuard)
  @Post('get')
  async getDatabaseRules() {
    return await this.databaseRulesService.getDatabaseRules();
  }

  @UseGuards(AdminGuard)
  @Post('set')
  async setDatabaseRules(@Body() setDatabaseRulesDto: SetDatabaseRulesDto) {
    await this.databaseRulesService.setDatabaseRules(setDatabaseRulesDto);
  }
}
