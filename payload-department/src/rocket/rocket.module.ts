import { Module } from "@nestjs/common";
import { RocketController } from "./controller/rocket.controller";
import { RocketService } from "./service/rocket.service";

@Module({
    imports: [],
    controllers: [RocketController],
    providers: [RocketService],
    exports: []
})

export class RocketModule {};