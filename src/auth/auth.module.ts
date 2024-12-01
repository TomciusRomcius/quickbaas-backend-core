import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from 'src/jwt/jwt.module';
import { ServerMiddleware } from 'src/functions/server-middleware/server-middleware';
import { ServerMiddlewareModule } from 'src/functions/server-middleware/server-middleware.module';
import { DatabaseClientOperationModule } from 'src/database-client-operation/database-client-operation.module';

@Module({
  imports: [JwtModule, DatabaseClientOperationModule, ServerMiddlewareModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ServerMiddleware).forRoutes(AuthController);
  }
}
