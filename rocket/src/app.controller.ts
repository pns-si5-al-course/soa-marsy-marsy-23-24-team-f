import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}
  @Get()
  getOK() {
    return { status: 'ok'};
  }

  @Post('/stop-simulation')
  @HttpCode(200)
  async stopSimulation() {
    const res = await this.appService.stopSimulation()
    return res;
  }

}
