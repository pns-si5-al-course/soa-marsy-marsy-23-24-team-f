import { Injectable } from '@nestjs/common';
import { Model } from "mongoose";
import { KafkaService } from '../kafka/kafka.service';
import { KafkaPayload } from '../kafka/kafka.message';
import { ROCKET_FIXED_TOPIC } from '../constant';
import { RocketService } from '../rocket/service/rocket.service';
import { InjectModel } from '@nestjs/mongoose';
import { Telemetrics } from '../../schema/telemetrics.schema';

@Injectable()
export class PublisherService {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly rocketService: RocketService,
    @InjectModel(Telemetrics.name) private telemetricsModel: Model<Telemetrics> ) {}

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
      topicName: 'rocket.topic',
    };
    return payload;
  }

  async sendTelemetrics() {
    const telemetrics = await this.rocketService.getLastTelemetrics()
    .catch((error) => {
      console.log(error);
      return error
    })
    const payload = this.createPayload('rocket.telemetrics.topic', telemetrics);
    const value = await this.kafkaService.sendMessage('rocket.telemetrics.topic', payload);
    console.log('kafka status ', value);
    return telemetrics;
  }
}
