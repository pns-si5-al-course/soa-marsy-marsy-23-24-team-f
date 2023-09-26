import { Body, Controller, Get, HttpCode, Post, Headers, HttpException, HttpStatus } from "@nestjs/common";
import { error } from "console";

@Controller("rocket")
export class RocketController {

    @Get()
    getStatus( @Headers('Authorization') auth: string) {
      if (auth == "missioncontrol-token"){
        return { passengers: 0, altitude: 2000, weight: 100};
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