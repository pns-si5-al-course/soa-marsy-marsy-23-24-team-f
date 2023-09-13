import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { StatusModule } from './status/status.module';
import { RocketController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    StatusModule,
  ],
  controllers: [RocketController],
  providers: [],
})
export class AppModule {}
