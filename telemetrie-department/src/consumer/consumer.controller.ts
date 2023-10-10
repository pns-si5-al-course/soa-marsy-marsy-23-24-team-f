
import { Controller, Get } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { MyWebSocketGateway } from '../gateway/websocket.gateway';

@Controller('consumer')
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService, private readonly webSocketGateway: MyWebSocketGateway) {}

  @Get()
  getHello(): void {
    const d = this.consumerService.getDatas();
    console.log('----------------', d, '----------------');
    this.webSocketGateway.server.emit('telemetrics', d);
  }
}