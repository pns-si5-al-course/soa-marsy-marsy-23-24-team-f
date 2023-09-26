import { Module } from "@nestjs/common";
import { StatusController } from "./controller/status.controller";

import { RocketModule } from '../rocket/rocket.module';

@Module({
    imports: [RocketModule],
    controllers: [StatusController],
    providers: [],
    exports: []
})

export class StatusModule {};