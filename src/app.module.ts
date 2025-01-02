import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseClientModule } from './database-client/database-client.module';
import { DatabaseModule } from './database/database.module';
import { ServerMiddlewareModule } from './functions/server-middleware/server-middleware.module';
import { ServerFunctionsModule } from './functions/server-functions/server-functions.module';
import { DatabaseClientOperationModule } from './database-client-operation/database-client-operation.module';
import { setupConfigModule } from './common/utils/setup-config-module';
import { DatabaseRulesModule } from './database-rules/database-rules.module';
import { CachingModule } from './caching/caching.module';

@Module({
  imports: [
    setupConfigModule(),
    DatabaseModule,
    UserModule,
    AuthModule,
    ServerFunctionsModule,
    ServerMiddlewareModule,
    DatabaseClientModule,
    DatabaseClientOperationModule,
    DatabaseRulesModule,
    CachingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
