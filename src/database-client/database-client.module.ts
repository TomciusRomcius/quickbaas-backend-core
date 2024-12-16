import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseClientController } from './database-client.controller';
import { ServerMiddleware } from 'src/functions/server-middleware/server-middleware';
import { ServerMiddlewareModule } from 'src/functions/server-middleware/server-middleware.module';
import { DatabaseClientOperationModule } from 'src/database-client-operation/database-client-operation.module';
import { DatabaseRulesMiddleware } from 'src/database-rules/database-rules-middleware';
import { DatabaseRulesModule } from 'src/database-rules/database-rules.module';

@Module({
  imports: [
    ServerMiddlewareModule,
    DatabaseClientOperationModule,
    DatabaseClientOperationModule,
    DatabaseRulesModule,
  ],
  controllers: [DatabaseClientController],
})
export class DatabaseClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DatabaseRulesMiddleware).forRoutes(DatabaseClientController);
    consumer.apply(ServerMiddleware).forRoutes(DatabaseClientController);
  }
}
