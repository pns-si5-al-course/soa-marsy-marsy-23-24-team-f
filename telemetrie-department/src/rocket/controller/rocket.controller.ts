//README: this is the controllers for rocket routes --!! not rocket department routes !!--

import { Body, Controller, Get, HttpCode, Post, Headers, HttpException, HttpStatus } from "@nestjs/common";

import { RocketService } from "../service/rocket.service";
import { TelemetricsDto } from "../../../dto/create-telemetrics.dto";

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StageDto } from "../../../dto/create-stage.dto";

@ApiTags('Rocket')
@Controller("rocket")
export class RocketController {
    constructor(private readonly rocketService: RocketService) {}

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

    @Get("stage")
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Get the stage data stored in the database',
        content: {
          'application/json': {
            example: StageDto,
          },
        },
    })
    async getStage() {
        const data = await this.rocketService.getLastStage()
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return {message: "No stage found"}
        });
        return data;
    }

}