import { Module } from '@nestjs/common';
import { PayloadController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import configuration from 'config/configuration';
import { RocketModule } from './rocket/rocket.module';
import mongodbConfig from 'shared/config/mongodb.configuration';
import { MongooseConfigService } from 'shared/services/mongodb-configuration.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsumerModule } from './consumer/consumer.module';
import { KafkaModule } from './kafka/kafka.module';
import { WebSocketModule } from './gateway/websocket.module';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration, mongodbConfig],
    isGlobal: true,
  }),
  RocketModule, 
  HttpModule,
  KafkaModule.register({
    clientId: 'rocket-consumer',
    brokers: ['kafka:19092'],
    groupId: 'rocket-group',
  }),
  WebSocketModule,
  ConsumerModule,
  MongooseModule.forRootAsync({
    useClass: MongooseConfigService,
  })
],
  controllers: [PayloadController],
  providers: [],
})
export class AppModule {}