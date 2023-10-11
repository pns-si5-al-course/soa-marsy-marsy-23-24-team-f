import { Module } from '@nestjs/common';
import { MyWebSocketGateway } from './websocket.gateway';

@Module({
  providers: [MyWebSocketGateway],
  exports: [MyWebSocketGateway],
})
export class WebSocketModule {}
