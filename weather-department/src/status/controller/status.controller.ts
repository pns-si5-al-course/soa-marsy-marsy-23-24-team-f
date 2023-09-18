import { Body, Controller, Get, HttpCode, Post, Headers, HttpException, HttpStatus } from "@nestjs/common";
import { error } from "console";

@Controller("status")
export class StatusController {

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
}