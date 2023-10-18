import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { KafkaPayload } from '../kafka/kafka.message';
import { ROCKET_FIXED_TOPIC } from '../constant';
import { Rocket } from 'src/entities/rocket.entity';


@Injectable()
export class PublisherService {
  constructor(
    private readonly kafkaService: KafkaService,
   ) {}

  getHello() {
    return {
      value: 'hello world',
    };
  }

  createPayload(topic: string, data: any): KafkaPayload{
    const payload: KafkaPayload = {
      messageId: '' + new Date().valueOf(),
      body: data,
      messageType: 'Push.Telemetrics',
      topicName: topic,
    };
    return payload;
  }

  async sendTelemetrics(topic: string, telemetrics: Rocket) {
    // console.log("[ROCKET-OBJECT] : ", telemetrics)
    const payload = this.createPayload(topic, telemetrics);
    const value = await this.kafkaService.sendMessage(topic, payload);
    console.log('kafka status ', value);
    return telemetrics;
  }

}
