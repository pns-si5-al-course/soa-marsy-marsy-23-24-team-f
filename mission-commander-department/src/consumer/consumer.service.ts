import { Bind, Injectable } from '@nestjs/common';
import {
  SubscribeTo,
  SubscribeToFixedGroup, 
} from '../kafka/kafka.decorator';
import { KafkaPayload } from '../kafka/kafka.message';
import { ROCKET_FIXED_TOPIC, ROCKET_TELEMETRICS_TOPIC, PAYLOAD_TELEMETRICS_TOPIC, LOGS_TOPIC } from '../constant';
import { DataStore } from '../gateway/DataStore';



@Injectable()
export class ConsumerService {

  constructor() {
    this.logsTelemetricsSubscriber = this.logsTelemetricsSubscriber.bind(this);
  }
  /**
   * When group id is unique for every container.
   * @param payload
   */
  @SubscribeTo(LOGS_TOPIC)
  @Bind()
  logsTelemetricsSubscriber (logs: any) {
    console.log("logsTelemetricsSubscriber", logs)
    if (DataStore) {DataStore.addRocketData(logs);}
  }

}