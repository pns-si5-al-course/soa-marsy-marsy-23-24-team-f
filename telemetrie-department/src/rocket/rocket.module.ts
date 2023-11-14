import { Module } from "@nestjs/common";
import { RocketController } from "./controller/rocket.controller";
import { Telemetrics, TelemetricsSchema } from "schema/telemetrics.schema";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { RocketService } from "./service/rocket.service";
import { Stage, StageSchema } from "../../schema/stage.schema";



@Module({
    imports: [MongooseModule.forFeature([{name: Telemetrics.name, schema: TelemetricsSchema}, {name: Stage.name, schema: StageSchema}])],
    controllers: [RocketController],
    providers: [RocketService],
    exports: [RocketService]
})

export class RocketModule {};