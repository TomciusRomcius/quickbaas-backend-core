import { Module } from '@nestjs/common';
import { DatabaseClientService } from './database-client.service';
import { DatabaseClientController } from './database-client.controller';

@Module({
  controllers: [DatabaseClientController],
  providers: [DatabaseClientService],
})
export class DatabaseClientModule {}
