import { Module } from '@nestjs/common';
import { WeatherController } from './app.controller';

@Module({
  imports: [],
  controllers: [WeatherController],
  providers: [],
})
export class AppModule {}
