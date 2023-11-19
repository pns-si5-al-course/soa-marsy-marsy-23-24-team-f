import { Module } from '@nestjs/common';
//import { RocketService } from './rocket.service';
import { RocketController } from './rocket.controller';
import { HttpModule } from '@nestjs/axios';
import { PublisherModule } from 'src/publisher/publisher.module';
import { RocketStatelessService } from './rocket.stateless.service';
import { PublisherService } from '../publisher/publisher.service';

@Module({
  imports : [HttpModule, PublisherModule],
  controllers: [RocketController],
  providers: [RocketStatelessService, PublisherService],
  exports: [RocketStatelessService]
})
export class RocketModule {}

export class Rocket {
  name: string;
  status: 'On Ground' | 'In Flight' | 'Staged' | 'Payload Delivered';
  fuelFirstStage: number; // 0-100 percentage
}


