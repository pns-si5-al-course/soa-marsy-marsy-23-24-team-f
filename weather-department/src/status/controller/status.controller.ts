import { Body, Controller, Get, HttpCode, Post, Headers, HttpException, HttpStatus } from "@nestjs/common";
import { error } from "console";

@Controller("status")
export class StatusController {

  @Get()
  getStatus() {
    return { status: "GO" };
  }
}