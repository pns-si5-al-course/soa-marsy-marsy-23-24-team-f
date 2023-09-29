import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { RocketController } from './app.controller';
import { RocketModule } from './rocket/rocket.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    RocketModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [RocketController],
  providers: [],
})
export class AppModule {}
