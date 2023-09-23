import { Module } from "@nestjs/common";
import { RocketController } from "./controller/rocket.controller";

@Module({
    imports: [],
    controllers: [RocketController],
    providers: [],
    exports: []
})

export class RocketModule {};