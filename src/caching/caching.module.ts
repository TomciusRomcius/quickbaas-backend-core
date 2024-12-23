import { Module } from '@nestjs/common';
import { CachingService } from './caching.service';

@Module({
  exports: [CachingService],
  providers: [CachingService]
})

export class CachingModule { }
