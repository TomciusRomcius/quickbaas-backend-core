import { Module } from '@nestjs/common';
import { ServerFunctionsService } from './server-functions.service';
import { ServerFunctionsController } from './server-functions.controller';
import { DatabaseClientModule } from 'src/database-client/database-client.module';

@Module({
  imports: [DatabaseClientModule],
  controllers: [ServerFunctionsController],
  providers: [ServerFunctionsService],
})
export class ServerFunctionsModule {}
