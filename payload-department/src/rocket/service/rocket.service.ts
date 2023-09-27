import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';

const telemetrieServiceUrl = process.env.TELEMETRIE_SERVICE_URL;

@Injectable()
export class RocketService {

    constructor(private httpService: HttpService) {}

    async askForTelemetricsData(): Promise<any> {
        console.log('Gwynne : asking for telemetrics updates');
        const timeout = setInterval(async () => {
          try {
            const res = await this.httpService.get(telemetrieServiceUrl + '/rocket/telemetrics').toPromise()
            .then(data => {
              console.log('Gwynne : telemetrics updated');
              console.log(data);
            })
          } catch (error) {
              throw error;
          }
        }, 2000);
    }
}