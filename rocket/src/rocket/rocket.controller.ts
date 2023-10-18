import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { RocketService } from './rocket.service';

@Controller('rocket')
export class RocketController {
  constructor(private readonly rocketService: RocketService) {}

  @Get('info')
  getRocket() {
    return this.rocketService.getRocket();
    
  }

  @Post('sendToMission')
  @HttpCode(201)
  sendToMission(@Body() data: any) {
    return this.rocketService.sendToMission(data);
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
    return this.rocketService.initiateLaunchSequence();
  }

  @Post('MaxQ')
  @HttpCode(200)
  handleMaxQ() {
    return this.rocketService.handleMaxQ();
  }

  @Post('takeoffwithfailure')
  @HttpCode(201)
  takeOffWithFailure() {
    console.log("Received takeoff permission (scenario2): \r");
    return this.rocketService.takeOffWithFailure();
  }

  @Post('destroy')
  @HttpCode(200)
  destroyRocket() {
    console.log("Received destroy command: \r");
    return this.rocketService.destroyRocket();
  }

  @Post('sendTestRocket')
  @HttpCode(200)
  sendTestRocket() {
    console.log("Received test rocket command: \r");
    return this.rocketService.sendTestData();
  }

  @Post('stopTrasmission')
  @HttpCode(200)
  stopTrasmission() {
    console.log("Received stop trasmission command: \r");
    return this.rocketService.stopTransmitting();
  }
}