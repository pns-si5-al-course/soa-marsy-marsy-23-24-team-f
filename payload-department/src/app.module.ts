import { Module } from '@nestjs/common';
import { PayloadController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import configuration from 'config/configuration';
import { RocketModule } from './rocket/rocket.module';
import mongodbConfig from 'shared/config/mongodb.configuration';
import { MongooseConfigService } from 'shared/services/mongodb-configuration.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration, mongodbConfig],
    isGlobal: true,
  }),
  RocketModule, 
  HttpModule,
  MongooseModule.forRootAsync({
    useClass: MongooseConfigService,
  })
],
  controllers: [PayloadController],
  providers: [],
})
export class AppModule {}