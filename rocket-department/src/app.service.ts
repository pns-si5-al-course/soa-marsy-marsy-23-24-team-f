import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
    constructor(private httpService: HttpService) {}

    async post(url): Promise<any> {
        await this.httpService.post(url).toPromise()
        .catch(error => {
            console.error('Error stopping simulation:', error.message);
            throw error;
        });
    }

    async stopSimulation(): Promise<any> {
        try {
            await this.post("http://rocket-object-service:3005/stop-simulation");
            await this.post("http://telemetrie-service:3003/rocket/stop-simulation");
        } catch (error) {
            console.error('Error stopping simulation:', error.message);
            throw error;
        }
    }
}
