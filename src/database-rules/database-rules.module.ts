import { Module } from '@nestjs/common';
import { DatabaseRulesService } from './database-rules.service';
import { DatabaseRulesController } from './database-rules.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [DatabaseRulesService],
  controllers: [DatabaseRulesController],
  exports: [DatabaseRulesService],
  /* TODO: Find a better way to initialize the database first
  as the database module is not used here */
  imports: [DatabaseModule],
})
export class DatabaseRulesModule {}
