import { Module } from '@nestjs/common';
import { RocketController } from './controller/rocket.controller';
import { RocketService } from './service/rocket.service';
import { HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpService],
  controllers: [RocketController],
  providers: [RocketService]
})
export class RocketModule {}
