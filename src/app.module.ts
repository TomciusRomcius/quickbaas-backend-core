import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseService } from './database/database.service';
import { JwtService } from './jwt/jwt.service';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseClientModule } from './database-client/database-client.module';
import { DatabaseModule } from './database/database.module';
import { ServerMiddlewareModule } from './functions/server-middleware/server-middleware.module';
import { ServerFunctionsModule } from './functions/server-functions/server-functions.module';
import { DatabaseClientOperationService } from './database-client-operation/database-client-operation.service';
import { DatabaseClientOperationModule } from './database-client-operation/database-client-operation.module';
import { JwtMiddleware } from './common/utils/jwtMiddleware';
import { setupConfigModule } from './common/utils/setup-config-module';
import { DatabaseRulesModule } from './database-rules/database-rules.module';

@Module({
  imports: [
    setupConfigModule(),
    DatabaseModule,
    JwtModule,
    UserModule,
    AuthModule,
    ServerFunctionsModule,
    ServerMiddlewareModule,
    DatabaseClientModule,
    DatabaseClientOperationModule,
    DatabaseRulesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
    JwtService,
    DatabaseClientOperationService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
