import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { RocketService } from './rocket.service';

@Controller('rocket')
export class RocketController {
  constructor(private readonly rocketService: RocketService) {}

  @Get('info')
  getRocket() {
    return this.rocketService.getRocket();
    
  }

  @Get('isReady')
  @HttpCode(200)
  isReady() {
    return this.rocketService.isReady();
  }

  @Post('setpayload')
  @HttpCode(201)
  setPayload(@Body() payload: any) {
    return this.rocketService.setPayload(payload);
  }

  @Post('takeoff')
  @HttpCode(201)
  takeOff() {
    console.log("Received takeoff permission: \r");
    return this.rocketService.takeOff();
  }
}

