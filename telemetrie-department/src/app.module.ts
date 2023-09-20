import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';

import mongodbConfig from 'shared/config/mongodb.configuration';
import { MongooseConfigService } from 'shared/services/mongodb-configuration.service';

import { RocketModule } from './rocket/rocket.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
  ConfigModule.forRoot({
    load: [configuration, mongodbConfig],
    isGlobal: true,
  }),
  RocketModule, 
  MongooseModule.forRoot('mongodb://localhost/telemetrie-DB'),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
