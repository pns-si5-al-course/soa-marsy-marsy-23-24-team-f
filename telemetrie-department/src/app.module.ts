import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';

import mongodbConfig from 'shared/config/mongodb.configuration';
import { MongooseConfigService } from 'shared/services/mongodb-configuration.service';

import { RocketModule } from './rocket/rocket.module';
import { MongooseModule } from '@nestjs/mongoose';

import { KafkaModule } from './kafka/kafka.module';
import { ConsumerModule } from './consumer/consumer.module';
import { DefaultModule } from './default/default.module';

@Module({
  imports: [
  ConfigModule.forRoot({
    load: [configuration, mongodbConfig],
    isGlobal: true,
  }),
  KafkaModule.register({
    clientId: 'rocket-consumer',
    brokers: ['kafka:19092'],
    groupId: 'rocket-group',
  }),
  RocketModule, 
  ConsumerModule,
  DefaultModule,
  // MongooseModule.forRoot(process.env.MONGO_U),
  MongooseModule.forRootAsync({
    useClass: MongooseConfigService,
  })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
