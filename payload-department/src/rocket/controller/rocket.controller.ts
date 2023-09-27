import { Body, Controller, Get, HttpCode, Post, Headers, HttpException, HttpStatus } from "@nestjs/common";
import { error } from "console";

@Controller("rocket")
export class RocketController {

    @Get()
    getStatus( @Headers('Authorization') auth: string) {
      return { passengers: 0, altitude: 2000, weight: 100};
    }
}