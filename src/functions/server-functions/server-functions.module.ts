import { Module } from '@nestjs/common';
import { ServerFunctionsService } from './server-functions.service';
import { ServerFunctionsController } from './server-functions.controller';
import { DatabaseClientOperationModule } from 'src/database-client-operation/database-client-operation.module';

@Module({
  imports: [DatabaseClientOperationModule],
  controllers: [ServerFunctionsController],
  providers: [ServerFunctionsService],
})
export class ServerFunctionsModule {}
