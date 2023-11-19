import { Controller, Get, Post, HttpCode, Body, InternalServerErrorException } from '@nestjs/common';
import { RocketService } from '../service/rocket.service';
import { RocketDTO } from '../../dto/Rocket.dto';
import { ReadyToLaunchDTO } from '../../dto/ReadyToLaunch.dto';
import { AnomalyReportDTO } from 'src/dto/AnomalyReport.dto';

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

    @Post('initiate-startup')
    @HttpCode(200)
    async initiateStartup(@Body() readyToLaunch: ReadyToLaunchDTO): Promise<any> {
        try {
            return await this.rocketService.initiateStartupSequence(readyToLaunch);
        } catch (error) {
            throw new InternalServerErrorException("Failed to initiate rocket startup : "+error);
        }
    }

    @Post('initiate-main-engine-start')
    @HttpCode(200)
    async initiateMainEngineStart(@Body() rocket: RocketDTO): Promise<any> {
        try {
            return await this.rocketService.initiateMainEngineStart(rocket);
        } catch (error) {
            throw new InternalServerErrorException("Failed to initiate rocket main engine start.");
        }
    }

    @Post('initiate-liftoff')
    @HttpCode(200)
    async initiateLiftoff(@Body() rocket: RocketDTO): Promise<any> {
        try {
            return await this.rocketService.initiateLiftoff(rocket);
        } catch (error) {
            throw new InternalServerErrorException("Failed to initiate rocket liftoff.");
        }
    }

    @Post('launch')
    @HttpCode(200)
    async launchRocket(@Body() readyToLaunch: ReadyToLaunchDTO): Promise<any> {
        try {
            await this.rocketService.launchRocket(readyToLaunch);
            return readyToLaunch.rocket;
        } catch (error) {
            throw new InternalServerErrorException("Failed to launch the rocket.");
        }
    }

    @Post('anomaly')
    @HttpCode(200)
    async reportAnomaly(@Body() anomalyReport: AnomalyReportDTO): Promise<void> {
        try {
            await this.rocketService.reportAnomaly(anomalyReport);
        } catch (error) {
            throw new InternalServerErrorException("Failed to report anomaly: "+error.message);
        }
    }
}
