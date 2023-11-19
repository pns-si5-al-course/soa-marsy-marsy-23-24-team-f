import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RocketModule } from './rocket/rocket.module';
import { HttpModule } from '@nestjs/axios';
//import { RocketService } from './rocket/rocket.service';

import { KafkaModule } from './kafka/kafka.module';
import { PublisherModule } from './publisher/publisher.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    HttpModule,
    KafkaModule.register({
      clientId: 'rocket-publisher',
      brokers: [process.env.KAFKA_BROKER],
      groupId: 'rocket-group',
    }),
    PublisherModule,
    RocketModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
