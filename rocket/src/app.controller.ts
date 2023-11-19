import { Controller, Get, HttpCode, Post } from '@nestjs/common';

@Controller()
export class AppController {

  constructor() {}
  @Get()
  getOK() {
    return { status: 'ok'};
  }

}
