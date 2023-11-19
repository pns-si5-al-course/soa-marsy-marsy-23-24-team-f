import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [],
  providers: [ConsumerService],
  controllers: [],
  exports: [ConsumerService],
})
export class ConsumerModule {}
