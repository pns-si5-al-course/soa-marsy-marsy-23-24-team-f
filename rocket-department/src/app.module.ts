import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { AppController } from './app.controller';
import { RocketModule } from './rocket/rocket.module';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { KafkaModule } from './kafka/kafka.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    RocketModule,
    HttpModule,
    KafkaModule.register({
      clientId: 'rocket-consumer',
      brokers: [process.env.KAFKA_BROKER],
      groupId: 'rocket-group',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
