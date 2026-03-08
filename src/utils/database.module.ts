import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { envConfigOptions } from 'src/config/env.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(envConfigOptions)],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
