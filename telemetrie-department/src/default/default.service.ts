import { Injectable } from '@nestjs/common';
import { Model } from "mongoose";
import { KafkaService } from '../kafka/kafka.service';
import { KafkaPayload } from '../kafka/kafka.message';
import { ROCKET_FIXED_TOPIC } from '../constant';
import { RocketService } from '../rocket/service/rocket.service';
import { InjectModel } from '@nestjs/mongoose';
import { Telemetrics } from '../../schema/telemetrics.schema';

@Injectable()
export class DefaultService {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly rocketService: RocketService,
    @InjectModel(Telemetrics.name) private telemetricsModel: Model<Telemetrics> ) {}

  getHello() {
    return {
      value: 'hello world',
    };
  }

  createPayload(data: any): KafkaPayload{
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
    console.log(telemetrics)
    const payload = this.createPayload(telemetrics);
    const value = await this.kafkaService.sendMessage('rocket.topic', payload);
    console.log('kafka status ', value);
    return telemetrics;
  }


  async send() {
    const message = {
      value: 'Message send to Kakfa Topic',
    };
    const payload = this.createPayload(message);
    const value = await this.kafkaService.sendMessage('rocket.topic', payload);
    console.log('kafka status ', value);
    return message;
  }

  async sendToFixedConsumer() {
    const message = {
      value: 'Message send to Kakfa Topic',
    };
    const payload: KafkaPayload = {
      messageId: '' + new Date().valueOf(),
      body: message,
      messageType: 'Say.Hello',
      topicName: ROCKET_FIXED_TOPIC, // topic name could be any name
    };
    const value = await this.kafkaService.sendMessage(
      ROCKET_FIXED_TOPIC,
      payload,
    );
    console.log('kafka status ', value);
    return message;
  }
}
