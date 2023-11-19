import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Headers, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { RocketService } from '../service/rocket.service';
import { error } from 'console';
import { RocketDTO } from '../dto/rocket.dto';

@ApiTags('rocket')
@Controller('rocket')
export class RocketController {
  constructor(private readonly rocketService: RocketService) {}

  @ApiOperation({ summary: 'Initiate startup sequence for a rocket' })
  @ApiBody({ type: RocketDTO })
  @ApiResponse({ status: 200, description: 'Startup sequence initiated', type: RocketDTO })
  @ApiResponse({ status: 400, description: 'Startup initiation failed' })
  @Post('initiate-startup')
  @HttpCode(200)
  async initiateStartup(@Body() rocket: RocketDTO): Promise<RocketDTO> {
    console.log("Receiving startup command.")
    try {
      return await this.rocketService.initiateStartupSequence(rocket);
    } catch (error) {
      throw new HttpException('Startup initiation failed', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Initiate main engine start for a rocket' })
  @ApiBody({ type: RocketDTO })
  @ApiResponse({ status: 200, description: 'Main engine start initiated', type: RocketDTO })
  @ApiResponse({ status: 400, description: 'Main engine start failed' })
  @Post('initiate-main-engine-start')
  @HttpCode(200)
  async initiateMainEngineStart(@Body() rocket: RocketDTO): Promise<RocketDTO> {
    try {
      return await this.rocketService.initiateMainEngineStart(rocket);
    } catch (error) {
      throw new HttpException('Main engine start failed', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Initiate liftoff for a rocket' })
  @ApiBody({ type: RocketDTO })
  @ApiResponse({ status: 200, description: 'Liftoff initiated', type: RocketDTO })
  @ApiResponse({ status: 400, description: 'Liftoff failed' })
  @Post('initiate-liftoff')
  @HttpCode(200)
  async initiateLiftoff(@Body() rocket: RocketDTO): Promise<RocketDTO> {
    try {
      return await this.rocketService.initiateLiftoff(rocket);
    } catch (error) {
      throw new HttpException('Liftoff failed', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Get the current status of the rocket' })
  @ApiHeader({ name: 'Authorization', description: 'Auth token' })
  @ApiResponse({ status: 200, description: 'Status retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @Get('status')
  @HttpCode(200)
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

  @ApiOperation({ summary: 'Load payload onto the rocket' })
  @ApiBody({ type: RocketDTO })
  @ApiResponse({ status: 201, description: 'Payload loaded', type: RocketDTO })
  @Post('/load')
  @HttpCode(201)
  async loadPayload(@Body() rocket: RocketDTO): Promise<RocketDTO> {
    try {
      return await this.rocketService.loadRocket(rocket);
    } catch (error) {
      throw new HttpException('Payload loading failed', HttpStatus.BAD_REQUEST);
    }
  }
}
