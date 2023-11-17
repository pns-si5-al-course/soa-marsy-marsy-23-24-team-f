import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ReadyToLaunchDTO } from '../../dto/ReadyToLaunch.dto';
import { RocketDTO } from '../../dto/Rocket.dto';


@Injectable()
export class RocketService {
    constructor(private readonly httpService: HttpService) {}

    async getWeatherStatus(): Promise<{ status: string }> {
        try {
            const response = await this.httpService.get('http://weather-department:3001/weather/status').toPromise();
            return response.data;
        } catch (error) {
            throw new Error("Failed to get weather status.");
        }
    }

    async getRocketDeptStatus(): Promise<{ status: string }> {
        try {
            const response = await this.httpService.get('http://rocket-department:3001/rocket/status').toPromise();
            return response.data;
        } catch (error) {
            throw new Error("Failed to get rocket department status.");
        }
    }

    async launchRocket(readyToLaunch: ReadyToLaunchDTO): Promise<any> {
        try {
            if (readyToLaunch.weatherDepartmentStatus === "GO" && readyToLaunch.rocketDepartmentStatus === "GO"){
                return await this.httpService.post('http://rocket-department:3001/rocket/launch', readyToLaunch.rocket).toPromise();
            }
            console.log("Sent launch command.");
        } catch (error) {
            throw new Error("Failed to send launch command.");
        }
    }

    async initiateStartupSequence(rocket: RocketDTO): Promise<void> {
        try {
            await this.httpService.post('http://rocket-department:3001/rocket/initiate-startup', rocket).toPromise();
            console.log("Sent initiate startup command.");
        } catch (error) {
            throw new Error("Failed to send initiate startup command.");
        }
    }

    async initiateMainEngineStart(rocket: RocketDTO): Promise<void> {
        try {
            await this.httpService.post('http://rocket-department:3001/rocket/initiate-main-engine-start', rocket).toPromise();
            console.log("Sent initiate main engine start command.");
        } catch (error) {
            throw new Error("Failed to send initiate main engine start command.");
        }
    }

    async initiateLiftoff(rocket: RocketDTO): Promise<void> {
        try {
            await this.httpService.post('http://rocket-department:3001/rocket/initiate-liftoff', rocket).toPromise();
            console.log("Sent initiate liftoff command.");
        } catch (error) {
            throw new Error("Failed to send initiate liftoff command.");
        }
    }

    async destroyRocket(): Promise<void> {
        try {
            await this.httpService.post('http://rocket-object-service:3005/rocket/destroy').toPromise();
            console.log("Sent destroy command.");
        } catch (error) {
            throw new Error("Failed to send destroy command.");
        }
    }
}