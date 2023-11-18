import { Controller, Get, Post, Body, HttpCode, Param } from '@nestjs/common';
//import { RocketService } from './rocket.service';
import { RocketStatelessService } from './rocket.stateless.service';
import { Rocket, RocketExample } from '../entities/rocket.entity';
import { ApiBody, ApiTags, ApiProperty } from '@nestjs/swagger';
import { StatusUpdateDto } from '../dto/StatusUpdate.dto';


@Controller('rocket')
@ApiTags('Rocket')
export class RocketController {
  constructor(private readonly rocketService: RocketStatelessService) {}

  @Post('status')
  @HttpCode(200)
  async receiveStatusUpdate(@Body() statusUptate: StatusUpdateDto) {
    return this.rocketService.receiveStatusUpdate(statusUptate);
  }

  @Get('example')
  @HttpCode(200)
  getExample(): Rocket {
    return RocketExample;
  }

  @Post('setPayload')
  @HttpCode(201)
  setPayload(@Body() rocket: Rocket) {
    if (rocket.payload) {
      return { status: "Payload set" };
    }
  }

  // @Get('info')
  // getRocket() {
  //   return this.rocketService.getRocket();
    
  // }

  // @Get('isReady')
  // @HttpCode(200)
  // isReady() {
  //   return this.rocketService.isReady();
  // }

  // @Post('setpayload')
  // @HttpCode(201)
  // setPayload(@Body() payload: any) {
  //   return this.rocketService.setPayload(payload);
  // }

  // @Post('takeoff')
  // @HttpCode(201)
  // takeOff() {
  //   console.log("Received takeoff permission: \r");
  //   return this.rocketService.launch();
  // }

  // @Post('MaxQ')
  // @HttpCode(200)
  // handleMaxQ() {
  //   return this.rocketService.handleMaxQ();
  // }

  // @Post('takeoffwithfailure')
  // @HttpCode(201)
  // takeOffWithFailure() {
  //   console.log("Received takeoff permission (scenario2): \r");
  //   return this.rocketService.takeOffWithFailure();
  // }

  // @Post('destroy')
  // @HttpCode(200)
  // destroyRocket() {
  //   console.log("Received destroy command: \r");
  //   return this.rocketService.destroyRocket();
  // }

  // @Post('sendTestRocket')
  // @HttpCode(200)
  // sendTestRocket() {
  //   console.log("Received test rocket command: \r");
  //   return this.rocketService.sendTestData();
  // }

  // @Post('stopTrasmission')
  // @HttpCode(200)
  // stopTrasmission() {
  //   console.log("Received stop trasmission command: \r");
  //   return this.rocketService.stopTransmitting();
  // }

  // @Post('fuelLeak')
  // @HttpCode(200)
  // fuelLeak() {
  //   console.log("Received fuel leak command: \r");
  //   return this.rocketService.fuelLeak();
  // }

  // @Get('fuelConsumption/:stage_id')
  // @HttpCode(200)
  // fuelConsumption(@Param('stage_id') stage_id: number) {
  //   return this.rocketService.getFuelConsumptionBySeconds(stage_id);
  // }


  // @Get('speed')
  // @HttpCode(200)
  // getSpeed() {
  //   return this.rocketService.getMetterPerSecond();
  // }


}