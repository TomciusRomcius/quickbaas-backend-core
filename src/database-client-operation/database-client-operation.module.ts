import { Module } from '@nestjs/common';
import { DatabaseClientOperationService } from './database-client-operation.service';
import { CachingModule } from 'src/caching/caching.module';

@Module({
  imports: [CachingModule],
  exports: [DatabaseClientOperationService],
  providers: [DatabaseClientOperationService],
})
export class DatabaseClientOperationModule { }
