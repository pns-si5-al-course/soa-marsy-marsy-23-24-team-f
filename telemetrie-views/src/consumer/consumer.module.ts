import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { WebSocketModule } from '../gateway/websocket.module';

@Module({
  imports: [WebSocketModule],
  providers: [ConsumerService],
  controllers: [],
  exports: [ConsumerService],
})
export class ConsumerModule {
  constructor(){}
}
