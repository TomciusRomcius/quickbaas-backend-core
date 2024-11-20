import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseService } from './database/database.service';
import { JwtService } from './jwt/jwt.service';
import { JwtModule } from './jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    JwtModule,
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, JwtService],
})
export class AppModule {}
