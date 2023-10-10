import { Controller, Get, Post, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { PublisherService } from './publisher.service';

@Controller()
export class PublisherController {
  constructor(private readonly appService: PublisherService) {}

  @Get()
  getHello() {
  }

}
