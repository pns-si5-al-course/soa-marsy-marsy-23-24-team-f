import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Headers, HttpStatus, HttpException } from '@nestjs/common';
import { RocketService } from '../service/rocket.service';
import { error } from 'console';
import { RocketDTO } from '../dto/rocket.dto';

@Controller('rocket')
export class RocketController {
  constructor(private readonly rocketService: RocketService) {}

  @Post('initiate-startup')
  @HttpCode(200)
  async initiateStartup(@Body() rocket: RocketDTO): Promise<RocketDTO> {
    try {
      return await this.rocketService.initiateStartupSequence(rocket);
    } catch (error) {
      throw new HttpException('Startup initiation failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('initiate-main-engine-start')
  @HttpCode(200)
  initiateMainEngineStart(@Body() rocket: RocketDTO): Promise<RocketDTO> {
    try {
      return this.rocketService.initiateMainEngineStart(rocket);
    } catch (error) {
      throw new HttpException('Main engine start failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('initiate-liftoff')
  @HttpCode(200)
  initiateLiftoff(@Body() rocket: RocketDTO): Promise<RocketDTO> {
    try {
      return this.rocketService.initiateLiftoff(rocket);
    } catch (error) {
      throw new HttpException('Liftoff failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('status')
  getStatus( @Headers('Authorization') auth: string) {
    // TODO : check from telemetrics status rocket : Rocket on internal power
    if (auth == "missioncontrol-token"){
      return { status: "GO" };
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized access',
      }, HttpStatus.UNAUTHORIZED, {
        cause: error
      });
    }
  }

  @Post('/load')
  @HttpCode(201)
  loadPayload(@Body() rocket: RocketDTO): Promise<RocketDTO> {
    return this.rocketService.loadRocket(rocket);
  }

}
