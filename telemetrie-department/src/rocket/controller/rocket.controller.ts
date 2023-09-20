//README: this is the controllers for rocket routes --!! not rocket department routes !!--

import { Body, Controller, Get, HttpCode, Post, Headers, HttpException, HttpStatus } from "@nestjs/common";
import { error } from "console";
import { TelemetricsDto } from "dto/create-telemetrics.dto";
import { RocketService } from "src/rocket/service/rocket.service";

@Controller("rocket")
export class RocketController {
    constructor(private readonly rocketService: RocketService) {}
    @Post("telemetrics")
    @HttpCode(201)
    async postTelemetrics(@Body() body: TelemetricsDto) {
        await this.rocketService.createTelemetrics(body)
        .then((result) => {
            console.log(result);
        })
    }

    @Get("telemetrics")
    @HttpCode(200)
    async getTelemetrics() {
        const data = await this.rocketService.getLastTelemetrics()
        .then((result) => {
            return result;
        })
        return data;
    }
}