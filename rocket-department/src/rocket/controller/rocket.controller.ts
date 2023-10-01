import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Headers, HttpStatus, HttpException } from '@nestjs/common';
import { RocketService } from '../service/rocket.service';
import { CreateRocketDto } from '../dto/create-rocket.dto';
import { UpdateRocketDto } from '../dto/update-rocket.dto';
import { error } from 'console';

@Controller('rocket')
export class RocketController {
  constructor(private readonly rocketService: RocketService) {}

  @Post()
  @HttpCode(200)
  postStatus(@Body() body: any, @Headers('Authorization') auth: string) {
    console.log(body);
    if (auth == "missioncontrol-token"){
      if (body.status === "GO") {
        return this.rocketService.launchRocket();
      }
      else if(body.status === "Fail") {
        return this.rocketService.launchRocketWithFailure();
      }
      else {
        return { status: "ROCKET LAUNCH ABORTED" };
      }
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized access',
      }, HttpStatus.UNAUTHORIZED, {
        cause: error
      });
    }
  }


  @Get('/status')
  getStatus( @Headers('Authorization') auth: string) {
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
  loadPayload() {
    return this.rocketService.loadRocket();
  }

}
