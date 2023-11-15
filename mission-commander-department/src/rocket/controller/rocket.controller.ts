import { Controller, Get, Post, HttpCode, Body, InternalServerErrorException } from '@nestjs/common';
import { RocketService } from '../service/rocket.service';

@Controller('rocket')
export class RocketController {
    constructor(private readonly rocketService: RocketService) {}
    
    @Get('weatherDepartment/status')
    @HttpCode(200)
    async getWeatherStatus(): Promise<{ status: string }> {
        return this.rocketService.getWeatherStatus();
    }
    
    @Get('rocketDepartment/status')
    @HttpCode(200)
    async getRocketDeptStatus(): Promise<{ status: string }> {
        return this.rocketService.getRocketDeptStatus();
    }

    //destroy the rocket
    @Post('destroy')
    @HttpCode(201)
    async destroyRocket(): Promise<{ message: string }> {
        try {
            await this.rocketService.destroyRocket();
            return { message: "Rocket destroyed successfully." };
        } catch (error) {
            throw new InternalServerErrorException("Failed to destroy the rocket.");
        }
    }
}
