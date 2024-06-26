import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ReadyToLaunchDTO } from '../../dto/ReadyToLaunch.dto';
import { RocketDTO } from '../../dto/Rocket.dto';
import { AnomalyReportDTO } from 'src/dto/AnomalyReport.dto';


@Injectable()
export class RocketService {
    constructor(private readonly httpService: HttpService) {}

    async getWeatherStatus(): Promise<{ status: string }> {
        try {
            const response = await this.httpService.get('http://weather-service:3002/status').toPromise();
            return response.data;
        } catch (error) {
            throw new Error("Failed to get weather status.");
        }
    }

    async getRocketDeptStatus(): Promise<{ status: string }> {
        try {
            const response = await this.httpService.get('http://rocket-service:3001/').toPromise();
            return response.data;
        } catch (error) {
            throw new Error("Failed to get rocket department status.");
        }
    }

    async launchRocket(readyToLaunch: ReadyToLaunchDTO): Promise<any> {
        try {
            if (readyToLaunch.weatherDepartmentStatus === "GO" && readyToLaunch.rocketDepartmentStatus === "GO"){
                return await this.httpService.post('http://rocket-service:3001/rocket/launch', readyToLaunch.rocket).toPromise();
            }
            console.log("Sent launch command.");
        } catch (error) {
            throw new Error("Failed to send launch command.");
        }
    }

    async initiateStartupSequence(readyToLaunch: ReadyToLaunchDTO): Promise<any> {
        if(readyToLaunch.weatherDepartmentStatus !== "GO" && readyToLaunch.rocketDepartmentStatus !== "GO"){
            throw new Error("Weather or rocket department status is not GO.");
        }
        try {
            const rocketRes = await this.httpService.post('http://rocket-service:3001/rocket/load', readyToLaunch.rocket).toPromise();
            console.log("Sent initiate startup command.");
            console.log(rocketRes.data)
            const r = await this.httpService.post('http://rocket-service:3001/rocket/initiate-startup', rocketRes.data).toPromise();
            console.log(r.data)
            return r.data;
        } catch (error) {
            throw new Error("Failed to send initiate startup command. : "+error);
        }
    }

    async initiateMainEngineStart(rocket: RocketDTO): Promise<void> {
        try {
            const nrocket = await this.httpService.post('http://rocket-service:3001/rocket/initiate-main-engine-start', rocket).toPromise();
            console.log("Sent initiate main engine start command.");
            return nrocket.data;
        } catch (error) {
            throw new Error("Failed to send initiate main engine start command.");
        }
    }

    async initiateLiftoff(rocket: RocketDTO): Promise<void> {
        try {
            const nrocket = await this.httpService.post('http://rocket-service:3001/rocket/initiate-liftoff', rocket).toPromise();
            console.log("Sent initiate liftoff command.");
            return nrocket.data;
        } catch (error) {
            throw new Error("Failed to send initiate liftoff command.");
        }
    }

    async reportAnomaly(anomalyReport: AnomalyReportDTO): Promise<void> {
        console.log('Anomaly reported:', anomalyReport);
        if(anomalyReport.anomaly === "warning"){
            try {
                console.log("Anomaly checked : need to destroy manualy the rocket.");
                const statusUpdate = {
                    rocket: anomalyReport.rocket,
                    status: "Destruct"
                }
                await this.httpService.post('http://rocket-object-service:3005/rocket/status', statusUpdate).toPromise();
            } catch (error) {
                throw new Error("Failed to send anomaly report.");
            }
        }
    }
}