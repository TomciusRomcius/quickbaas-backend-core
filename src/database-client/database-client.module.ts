import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseClientController } from './database-client.controller';
import { ServerMiddleware } from 'src/functions/server-middleware/server-middleware';
import { ServerMiddlewareModule } from 'src/functions/server-middleware/server-middleware.module';
import { DatabaseClientOperationModule } from 'src/database-client-operation/database-client-operation.module';

@Module({
  imports: [
    ServerMiddlewareModule,
    DatabaseClientOperationModule,
    DatabaseClientOperationModule,
  ],
  controllers: [DatabaseClientController],
})
export class DatabaseClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ServerMiddleware).forRoutes(DatabaseClientController);
  }
}
