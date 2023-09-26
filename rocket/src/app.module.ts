import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RocketModule } from './rocket/rocket.module';

@Module({
  imports: [RocketModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
