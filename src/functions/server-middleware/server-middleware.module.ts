import { Module } from '@nestjs/common';
import { ServerMiddlewareService } from './server-middleware.service';
import { ServerMiddlewareController } from './server-middleware.controller';
import { DatabaseClientOperationModule } from 'src/database-client-operation/database-client-operation.module';

@Module({
  imports: [DatabaseClientOperationModule],
  exports: [ServerMiddlewareService],
  controllers: [ServerMiddlewareController],
  providers: [ServerMiddlewareService],
})
export class ServerMiddlewareModule {}
