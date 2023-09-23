import { Module } from '@nestjs/common';
import { PayloadController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { StatusModule } from './status/status.module';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true,
  }),
  StatusModule
],
  controllers: [PayloadController],
  providers: [],
})
export class AppModule {}
