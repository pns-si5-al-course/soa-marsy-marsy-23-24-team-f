import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
    constructor(private httpService: HttpService) {}

    async stopSimulation(): Promise<any> {
        await this.httpService.post('http://rocket-object-service:3005/stop-simulation').toPromise()
        .then(response => {
            console.log("Rocket simulation stopped: \r");
        })
        .catch(error => {
            console.error('Error stopping simulation:', error.message);
            throw error;
        });
    }
}
