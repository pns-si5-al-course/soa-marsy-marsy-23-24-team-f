import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { SseModule } from 'src/sse/sse.module';

@Module({
  imports: [SseModule],
  providers: [ConsumerService],
})
export class ConsumerModule {}
