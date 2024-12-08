import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseService } from './database/database.service';
import { JwtService } from './jwt/jwt.service';
import { JwtModule } from './jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseClientModule } from './database-client/database-client.module';
import { DatabaseModule } from './database/database.module';
import { ServerFunctionsModule } from './server-functions/server-functions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
    }),
    DatabaseModule,
    JwtModule,
    UserModule,
    AuthModule,
    DatabaseClientModule,
    DatabaseModule,
    ServerFunctionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, JwtService],
})
export class AppModule {}
