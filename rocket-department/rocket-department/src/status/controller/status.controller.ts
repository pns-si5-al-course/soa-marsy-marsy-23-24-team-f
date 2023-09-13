import { Body, Controller, Get, HttpCode, Param, Post, Request, Headers } from "@nestjs/common";

@Controller("status")
export class StatusController {

  @Get()
  getStatus() {
    return { status: "GO" };
  }

  @Post()
  @HttpCode(200)
  postStatus(@Body() body: { status: string }, @Headers('Authorization') auth: string) {
    // FIXME: need to implement auth check with a real key for the mission control
    // console.log(auth);
    if (body.status === "GO") {
      return { status: "ROCKET LAUNCHED" };
    } else {
      return { status: "ROCKET LAUNCH ABORTED" };
    }
  }
}