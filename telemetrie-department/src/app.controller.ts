import { Controller, Get, Render } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Root')
@Controller()
export class AppController {

  @Get()
  @Render('index')
  root() {
    return { message: '' };
  }

  @Get('isAlive')
  @ApiResponse({
    status: 200,
    description: 'GET sur l"etat du micro-service',
    content: {
      'application/json': {
        example: {
          status: 'ok',
        },
      },
    },
  })
  isAlive() {
    return {status:"ok"};
  }
}
