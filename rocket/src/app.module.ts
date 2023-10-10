import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RocketModule } from './rocket/rocket.module';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { RocketService } from './rocket/rocket.service';
import { KafkaModule } from './kafka/kafka.module';
import { PublisherModule } from './publisher/publisher.module';

@Module({
  imports: [
    RocketModule, 
    HttpModule,
    KafkaModule.register({
      clientId: 'rocket-publisher',
      brokers: ['kafka:19092'],
      groupId: 'rocket-group',
    }),
  PublisherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
