import { Controller, Get, Post, HttpCode, Body, InternalServerErrorException } from '@nestjs/common';
import { RocketService } from '../service/rocket.service';

@Controller('rocket')
export class RocketController {
    constructor(private readonly rocketService: RocketService) {}
    
    //ask for rocket status so we can decide if we can destroy it using the destroy endpoint
    @Get('status')
    @HttpCode(200)
    async getRocketStatus(): Promise<{ status: string }> {
        return await this.rocketService.getCurrentRocketStatus();
    }

    //record the rocket failure status
    @HttpCode(201)
    @Post('failure')
    async recordRocketFailure(@Body() data: { status: string }): Promise<any> {
        console.log("Received rocket failure status:", data.status);
        await this.rocketService.recordRocketFailure(data.status);
        return { message: "Rocket failure status recorded successfully." };
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
