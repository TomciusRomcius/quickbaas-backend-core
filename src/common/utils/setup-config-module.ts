import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

export function setupConfigModule() {
  Logger.log(`NODE ENVIRONMENT: ${process.env.NODE_ENV}`);
  let envs = [];
  if (process.env.NODE_ENV === 'development') {
    envs = ['.env.development', '.env.development.local'];
  }

  if (process.env.NODE_ENV === 'production') {
    envs = ['.env.production', '.env.production.local'];
  }

  if (process.env.NODE_ENV === 'testing') {
    envs = ['.env.test', '.env.test.local'];
  }

  return ConfigModule.forRoot({
    envFilePath: envs,
    isGlobal: true,
  });
}
