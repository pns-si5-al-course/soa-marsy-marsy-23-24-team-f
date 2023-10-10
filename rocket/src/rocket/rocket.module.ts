import { Module } from '@nestjs/common';
import { RocketService } from './rocket.service';
import { RocketController } from './rocket.controller';
import { HttpModule } from '@nestjs/axios';
import { PublisherModule } from 'src/publisher/publisher.module';

@Module({
  imports : [HttpModule, PublisherModule],
  controllers: [RocketController],
  providers: [RocketService],
  exports: [RocketService]
})
export class RocketModule {}

export class Rocket {
  name: string;
  status: 'On Ground' | 'In Flight' | 'Staged' | 'Payload Delivered';
  fuelFirstStage: number; // 0-100 percentage
}


