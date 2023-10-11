import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KafkaModule } from './kafka/kafka.module';
import { ConsumerModule } from './consumer/consumer.module';
import { WebSocketModule } from './gateway/websocket.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true,
  }),
  KafkaModule.register({
    clientId: 'rocket-consumer',
    brokers: [process.env.KAFKA_BROKER],
    groupId: 'rocket-group',
  }),
  WebSocketModule,
  ConsumerModule,],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
