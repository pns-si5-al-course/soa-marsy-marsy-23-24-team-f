import { Body, Controller, Get, HttpCode, Post, Headers, HttpException, HttpStatus } from "@nestjs/common";
import { error } from "console";

import { RocketService } from "../../rocket/rocket.service";

@Controller("status")
export class StatusController {

  constructor(private readonly rocketService: RocketService) {}

  @Get()
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

  @Post()
  @HttpCode(200)
  postStatus(@Body() body: { status: string }, @Headers('Authorization') auth: string) {
    if (auth == "missioncontrol-token"){
      if (body.status === "GO") {
        return this.rocketService.launchRocket();
      } else {
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
}