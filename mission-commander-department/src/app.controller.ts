import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('isAlive')
  isAlive() {
    return {status:"ok"};
  }
}