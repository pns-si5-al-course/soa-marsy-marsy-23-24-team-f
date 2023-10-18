import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RocketModule } from './rocket/rocket.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { KafkaModule } from './kafka/kafka.module';
import { WebSocketModule } from './gateway/websocket.module';
import { ConsumerModule } from './consumer/consumer.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    KafkaModule.register({
      clientId: 'rocket-consumer',
      brokers: [process.env.KAFKA_BROKER],
      groupId: 'rocket-group',
    }),
    WebSocketModule,
    ConsumerModule,
    RocketModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

