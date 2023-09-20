import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getIsUp(): string {
    return 'Service is UP!';
  }
}
