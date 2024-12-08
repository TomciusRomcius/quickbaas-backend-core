import { Module } from '@nestjs/common';
import { DatabaseRulesService } from './database-rules.service';
import { DatabaseRulesController } from './database-rules.controller';

@Module({
  providers: [DatabaseRulesService],
  controllers: [DatabaseRulesController]
})
export class DatabaseRulesModule {}
