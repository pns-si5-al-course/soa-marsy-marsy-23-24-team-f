import { Module } from '@nestjs/common';
import { DefaultService } from './default.service';
import { DefaultController } from './default.controller';
import { RocketService } from '../rocket/service/rocket.service';
import { RocketModule } from '../rocket/rocket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Telemetrics, TelemetricsSchema } from '../../schema/telemetrics.schema';

@Module({
  imports: [RocketModule, MongooseModule.forFeature([{name: Telemetrics.name, schema: TelemetricsSchema}])],
  providers: [DefaultService, RocketService],
  controllers: [DefaultController],
})
export class DefaultModule {}
