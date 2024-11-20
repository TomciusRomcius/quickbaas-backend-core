import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  exports: [JwtService],
  providers: [JwtService],
})
export class JwtModule {}
