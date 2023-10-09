import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { KafkaModule } from 'src/kafka/kafka.module';
import { KafkaService } from 'src/kafka/kafka.service';

@Module({
  imports: [],
  providers: [PublisherService],
  controllers: [PublisherController],
  exports:[PublisherService]
})
export class PublisherModule {}
