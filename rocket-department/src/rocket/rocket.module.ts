import { Module } from '@nestjs/common';
import { RocketService } from './rocket.service';
import { RocketController } from './rocket.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [RocketController],
  providers: [RocketService],
  exports: [RocketService],
})
export class RocketModule {}
