import { Module } from '@nestjs/common';
import { DatabaseClientService } from './database-client.service';
import { DatabaseClientController } from './database-client.controller';

@Module({
  exports: [DatabaseClientService],
  controllers: [DatabaseClientController],
  providers: [DatabaseClientService],
})
export class DatabaseClientModule {}
