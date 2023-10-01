import { Body, Controller, Get, HttpCode, Post, Headers, HttpException, HttpStatus } from "@nestjs/common";
import { error } from "console";
import { PayloadTelemetricsDto } from "../../../dto/create-payload-telemetrics.dto";
import { RocketService } from "../service/rocket.service";
@Controller("rocket")
export class RocketController {
    constructor(private readonly rocketService: RocketService) {}

    @Get()
    @HttpCode(200)
    getStatus() {
      return { passengers: 0, altitude: 0, weight: 100, speed:0, status: "Grounded"};
    }

    @Post("payload/data")
    @HttpCode(201)
    async postPayloadData(@Body() body: PayloadTelemetricsDto) {
        console.log(body)
        return this.rocketService.createPayloadTelemetrics(body);
    }

    @Get("payload/data")
    @HttpCode(200)
    async getPayloadData() {
        const data = await this.rocketService.getLastPayloadTelemetrics()
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return {message: "No payload telemetrics found"}
        });
        return data;
    }
}