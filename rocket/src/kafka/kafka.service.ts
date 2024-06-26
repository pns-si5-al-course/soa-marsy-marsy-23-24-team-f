import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';
import {
  SUBSCRIBER_FIXED_FN_REF_MAP,
  SUBSCRIBER_FN_REF_MAP,
  SUBSCRIBER_OBJ_REF_MAP,
} from './kafka.decorator';
import { KafkaConfig, KafkaPayload } from './kafka.message';
import { ROCKET_FIXED_TOPIC, ROCKET_TELEMETRICS_TOPIC, PAYLOAD_TELEMETRICS_TOPIC, LOGS_TOPIC } from '../constant';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private fixedConsumer: Consumer;
  private readonly consumerSuffix = '-' + Math.floor(Math.random() * 100000);
  private admin: any;

  constructor(private kafkaConfig: KafkaConfig) {
    this.kafka = new Kafka({
      clientId: this.kafkaConfig.clientId,
      brokers: this.kafkaConfig.brokers,
    });

    this.admin = this.kafka.admin();
    this.createTopic([
      ROCKET_TELEMETRICS_TOPIC,
      ROCKET_FIXED_TOPIC,
      PAYLOAD_TELEMETRICS_TOPIC,
      LOGS_TOPIC,
    ]);

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: this.kafkaConfig.groupId + this.consumerSuffix,
    });
    this.fixedConsumer = this.kafka.consumer({
      groupId: this.kafkaConfig.groupId,
    });
  }

  async createTopic(topics: string[]) {
    this.admin.connect();
    await this.admin.createTopics({
      topics: topics.map(topic => {
        return {
          topic,
        };
      }),
    });
    await this.admin.disconnect();
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    SUBSCRIBER_FN_REF_MAP.forEach((functionRef, topic) => {
      // attach the function with kafka topic name
      this.bindAllTopicToConsumer(functionRef, topic);
    });

    SUBSCRIBER_FIXED_FN_REF_MAP.forEach((functionRef, topic) => {
      // attach the function with kafka topic name
      this.bindAllTopicToFixedConsumer(functionRef, topic);
    });

    await this.fixedConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const functionRef = SUBSCRIBER_FIXED_FN_REF_MAP.get(topic);
        const object = SUBSCRIBER_OBJ_REF_MAP.get(topic);
        // bind the subscribed functions to topic
        await functionRef.apply(object, [message.value.toString()]);
      },
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const functionRef = SUBSCRIBER_FN_REF_MAP.get(topic);
        const object = SUBSCRIBER_OBJ_REF_MAP.get(topic);
        // bind the subscribed functions to topic
        await functionRef.apply(object, [message.value.toString()]);
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.fixedConsumer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    await this.fixedConsumer.disconnect();
  }

  async bindAllTopicToConsumer(callback, _topic) {
    await this.consumer.subscribe({ topic: _topic, fromBeginning: false });
  }

  async bindAllTopicToFixedConsumer(callback, _topic) {
    await this.fixedConsumer.subscribe({ topic: _topic, fromBeginning: false });
  }

  async sendMessage(kafkaTopic: string, kafkaMessage: KafkaPayload) {
    await this.producer.connect();
    const metadata = await this.producer
      .send({
        topic: kafkaTopic,
        messages: [{ value: JSON.stringify(kafkaMessage) }],
      })
      .catch(e => console.log(""));
    await this.producer.disconnect();
    return metadata;
  }
}
