import { Module } from '@nestjs/common';
import { DatabaseClientOperationService } from './database-client-operation.service';

@Module({
  exports: [DatabaseClientOperationService],
  providers: [DatabaseClientOperationService],
})
export class DatabaseClientOperationModule {}
