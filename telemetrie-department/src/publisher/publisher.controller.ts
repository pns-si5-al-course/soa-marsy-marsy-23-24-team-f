import { Controller, Get, Post, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { PublisherService } from './publisher.service';

@Controller()
export class PublisherController {
  constructor(private readonly appService: PublisherService) {}

  @Get()
  getHello() {
  }

  @Get('/send')
  async send() {
    return await this.appService.send();
  }

  @Get('/send/consumer')
  async sendToConsumer() {
    return await this.appService.send();
  }

  @Get('/send/fixed-consumer')
  async sendToFixedConsumer() {
    return await this.appService.sendToFixedConsumer();
  }

  @Get('/send/telemetrics')
  async sendTelemetrics() {
    return await this.appService.sendTelemetrics()
  }
}
