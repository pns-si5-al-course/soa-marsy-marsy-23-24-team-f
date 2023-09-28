import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RocketModule } from './rocket/rocket.module';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { RocketService } from './rocket/rocket.service';

@Module({
  imports: [
    RocketModule, 
    HttpModule,],
  controllers: [AppController],
  providers: [AppService, RocketService],
})
export class AppModule {}
