import { Controller, Get, Post, Body } from '@nestjs/common';
import { RocketService } from './rocket.service';

@Controller('rocket')
export class RocketController {
  constructor(private readonly rocketService: RocketService) {}

  @Get('info')
  getRocket() {
    return this.rocketService.getRocket();
    
  }

  @Post('setpayload')
  setPayload(@Body() payload: any) {
    return this.rocketService.setPayload(payload);
  }

  @Post('takeoff')
  takeOff() {
    return this.rocketService.takeOff();
  }
}

