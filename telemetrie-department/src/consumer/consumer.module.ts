import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { WebSocketModule } from '../gateway/websocket.module';
import { ConsumerController } from './consumer.controller';

@Module({
  imports: [WebSocketModule],
  providers: [ConsumerService],
  controllers: [ConsumerController],
  exports: [ConsumerService],
})
export class ConsumerModule {
  constructor(){
    console.log(WebSocketModule);
  }
}
