import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { RocketService } from '../rocket/service/rocket.service';
import { RocketModule } from '../rocket/rocket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Telemetrics, TelemetricsSchema } from '../../schema/telemetrics.schema';

@Module({
  imports: [RocketModule, MongooseModule.forFeature([{name: Telemetrics.name, schema: TelemetricsSchema}])],
  providers: [PublisherService, RocketService],
  controllers: [PublisherController],
  exports: [PublisherService]
})
export class PublisherModule {}
