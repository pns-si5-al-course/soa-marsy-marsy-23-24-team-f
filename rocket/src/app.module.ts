import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RocketModule } from './rocket/rocket.module';

@Module({
  imports: [RocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
