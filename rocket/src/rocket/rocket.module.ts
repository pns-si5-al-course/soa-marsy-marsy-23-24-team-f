import { Module } from '@nestjs/common';
import { RocketService } from './rocket.service';
import { RocketController } from './rocket.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports : [HttpModule],
  providers: [RocketService],
  controllers: [RocketController]
})
export class RocketModule {}

export class Rocket {
  name: string;
  status: 'On Ground' | 'In Flight' | 'Staged' | 'Payload Delivered';
  fuelFirstStage: number; // 0-100 percentage
}


