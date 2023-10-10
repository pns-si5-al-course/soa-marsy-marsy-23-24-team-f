import { Injectable } from '@nestjs/common';
import {
  SubscribeTo,
  SubscribeToFixedGroup,
} from '../kafka/kafka.decorator';
import { KafkaPayload } from '../kafka/kafka.message';
import { ROCKET_FIXED_TOPIC, ROCKET_TELEMETRICS_TOPIC, PAYLOAD_TELEMETRICS_TOPIC } from '../constant';

@Injectable()
export class ConsumerService {
  private datas: KafkaPayload[];

  constructor() {
    this.datas = [];
    this.rocketTelemetricsSubscriber = this.rocketTelemetricsSubscriber.bind(this);
  }

  getDatas() {
    return this.datas;
  }

  /**
   * When group id is unique for every container.
   * @param payload
   */
  @SubscribeTo(ROCKET_TELEMETRICS_TOPIC)
  rocketTelemetricsSubscriber (payload: KafkaPayload) {
    console.log('[KAKFA-CONSUMER] Print message after receiving', payload);
    // console.log('----------------', this.datas, '----------------');
    // console.log(this);
    if (this.datas) {this.datas.push(payload);}
  }

  
  /**
   * When application or container scale up &
   * consumer group id is same for application
   * @param payload
   */
  @SubscribeToFixedGroup(ROCKET_FIXED_TOPIC)
  helloSubscriberToFixedGroup(payload: KafkaPayload) {
    console.log(
      '[KAKFA-CONSUMER] Print message after receiving for fixed group',
      payload,
    );
  }

  homemadeFunction(payload: KafkaPayload) {
    this.rocketTelemetricsSubscriber = this.rocketTelemetricsSubscriber.bind(this);
    console.log('---------this-------', this, '---------this-------');
    console.log('---------this.datas-------', this.datas, '---------this.datas-------');
    this.datas.push(payload);
    return 'homemade function';
  }

  /**
   * When group id is unique for every container.
   * @param payload
   */
  @SubscribeTo(PAYLOAD_TELEMETRICS_TOPIC)
  helloSubscriber2(payload: KafkaPayload) {
    console.log('[KAKFA-CONSUMER] Print message after receiving', payload);
    console.log(this.homemadeFunction(payload));
}
}
