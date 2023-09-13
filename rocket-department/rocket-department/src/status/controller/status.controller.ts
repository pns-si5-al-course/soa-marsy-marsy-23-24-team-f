import { Body, Controller, Get, HttpCode, Param, Post, Request, Headers, HttpException, HttpStatus } from "@nestjs/common";
import { error } from "console";

@Controller("status")
export class StatusController {

  @Get()
  getStatus() {
    return { status: "GO" };
  }

  @Post()
  @HttpCode(200)
  postStatus(@Body() body: { status: string }, @Headers('Authorization') auth: string) {
    if (auth == "missioncontrol-token"){
      if (body.status === "GO") {
        return { status: "ROCKET LAUNCHED" };
      } else {
        return { status: "ROCKET LAUNCH ABORTED" };
      }
    } else {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      }, HttpStatus.UNAUTHORIZED, {
        cause: error
      });
    }
    
  }
}