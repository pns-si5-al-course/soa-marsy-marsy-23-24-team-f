import { Module } from '@nestjs/common';
import { RocketController } from './controller/rocket.controller';
import { RocketService } from './service/rocket.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [RocketController],
  providers: [RocketService]
})
export class RocketModule {}
