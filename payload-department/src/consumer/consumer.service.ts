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
  @SubscribeTo(PAYLOAD_TELEMETRICS_TOPIC)
  @Bind()
  rocketTelemetricsSubscriber (payload: KafkaPayload) {
    console.log('[KAKFA-CONSUMER] Print message after receiving', payload);
    if (DataStore) {DataStore.addData(payload);}
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
