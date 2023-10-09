import { Injectable } from '@nestjs/common';
import {
  SubscribeTo,
  SubscribeToFixedGroup,
} from '../kafka/kafka.decorator';
import { KafkaPayload } from '../kafka/kafka.message';
import { ROCKET_FIXED_TOPIC, ROCKET_TELEMETRICS_TOPIC, PAYLOAD_TELEMETRICS_TOPIC } from '../constant';
import { SseService } from '../sse/sse.service';

@Injectable()
export class ConsumerService {
  constructor(private readonly sseService: SseService) {}

  /**
   * When group id is unique for every container.
   * @param payload
   */
  @SubscribeTo(ROCKET_TELEMETRICS_TOPIC)
  rocketTelemetricsSubscriber(payload: KafkaPayload) {
    console.log('[KAKFA-CONSUMER] Print message after receiving', payload);
    // Émettre l'événement SSE avec les données de payload
    this.sseService.sendEvent(payload);
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
  @SubscribeTo('rocket.topic2')
  helloSubscriber2(payload: KafkaPayload) {
    console.log('[KAKFA-CONSUMER] Print message after receiving', payload);
  }

}
