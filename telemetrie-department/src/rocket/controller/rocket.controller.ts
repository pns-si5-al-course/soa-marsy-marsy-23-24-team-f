//README: this is the controllers for rocket routes --!! not rocket department routes !!--

import { Body, Controller, Get, HttpCode, Post, Headers, HttpException, HttpStatus } from "@nestjs/common";
import { error } from "console";

import { RocketService } from "../service/rocket.service";
import { TelemetricsDto } from "../../../dto/create-telemetrics.dto";

@Controller("rocket")
export class RocketController {
    constructor(private readonly rocketService: RocketService) {}

    @Post("start-simulation")
    @HttpCode(201)
    async startSimulation(): Promise<any> {
        this.rocketService.startSimulation();
        return { message: "Simulation started" };
    }

    @Post("telemetrics")
    @HttpCode(201)
    async postTelemetrics(@Body() body: TelemetricsDto) {
        const data = await this.rocketService.createTelemetrics(body)
        .then((result) => {
            console.log(result);
            return result;
        }
        ).catch((error) => {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        })
        return data;
    }

    @Get("telemetrics")
    @HttpCode(200)
    async getTelemetrics() {
        const data = await this.rocketService.getLastTelemetrics()
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return {message: "No telemetrics found"}
        });
        return data;
    }

    @Post("stop-simulation")
    @HttpCode(201)
    async stopSimulation() {
        this.rocketService.stopSimulation();
        const data = await this.rocketService.clearTelemetrics()
        .then((result) => {
            console.log(result);
            return result;
        }
        ).catch((error) => {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        })
        return data;
    }
}