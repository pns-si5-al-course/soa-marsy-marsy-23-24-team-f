import { Bind, Injectable } from '@nestjs/common';
import {
  SubscribeTo,
  SubscribeToFixedGroup, 
} from '../kafka/kafka.decorator';
import { KafkaPayload } from '../kafka/kafka.message';
import { ROCKET_FIXED_TOPIC, ROCKET_TELEMETRICS_TOPIC, PAYLOAD_TELEMETRICS_TOPIC } from '../constant';
import { DataStore } from '../gateway/DataStore';



@Injectable()
export class ConsumerService {

  constructor() {
    this.rocketTelemetricsSubscriber = this.rocketTelemetricsSubscriber.bind(this);
  }

  getDatas() {
    return DataStore.getDatas();
  }

  /**
   * When group id is unique for every container.
   * @param payload
   */
  @SubscribeTo(ROCKET_TELEMETRICS_TOPIC)
  @Bind()
  rocketTelemetricsSubscriber (payload: KafkaPayload) {
    console.log('[KAKFA-CONSUMER] Print message after receiving', payload);
    if (DataStore) {DataStore.addData(payload);}
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

  /**
   * When group id is unique for every container.
   * @param payload
   */
  // @SubscribeTo(PAYLOAD_TELEMETRICS_TOPIC)
  // helloSubscriber2(payload: KafkaPayload) {
  //   console.log('[KAKFA-CONSUMER] Print message after receiving', payload);
  //   console.log(this.homemadeFunction(payload));
  // }
}
