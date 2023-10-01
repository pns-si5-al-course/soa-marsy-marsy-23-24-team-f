import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { AppController } from './app.controller';
import { RocketModule } from './rocket/rocket.module';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    RocketModule,
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
