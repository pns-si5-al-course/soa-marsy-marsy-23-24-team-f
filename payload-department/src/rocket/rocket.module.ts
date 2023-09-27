import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { RocketController } from "./controller/rocket.controller";
import { RocketService } from "./service/rocket.service";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PayloadTelemetrics, PayloadTelemetricsSchema } from "schema/payloadTelemetrics.schema";

@Module({
    imports: [HttpModule, 
        MongooseModule.forFeature([{name: PayloadTelemetrics.name, schema: PayloadTelemetricsSchema}])],
    controllers: [RocketController],
    providers: [RocketService],
    exports: []
})

export class RocketModule {};