import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getOK() {
    return { status: 'ok'};
  }
}
