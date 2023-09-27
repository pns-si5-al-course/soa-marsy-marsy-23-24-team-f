import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class RocketService {
  constructor(private httpService: HttpService) {}

  private rocket = {
    name: 'MarsY-1',
    status: 'On Ground',
    stages: [
      {
        'id': 1,
        "fuel": 30,
      },
      {
        'id': 2,
        "fuel": 300,
      }
    ],
    altitude: 0,
    payload: null,
    timestamp: new Date().toISOString(),
  };

  async sendTelemetryData(url: string, data?: any): Promise<any> {
    const response$ = this.httpService.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await lastValueFrom(response$);
    return response.data;
  }

  isReady(): boolean {
    return this.rocket.payload !== null;
  }

  setPayload(payload: any): any {
    this.rocket.payload = payload;
    return this.rocket;
  }

  async takeOff(): Promise<any> {
    const data = JSON.stringify(this.rocket);
    console.log(data);

    const sendTelemetrics = await this.sendTelemetryData('http://telemetrie-service:3003/rocket/telemetrics', data);
    console.log(sendTelemetrics);
    
    this.rocket.status = 'In Flight';
    this.startFuelDepletion();

    return this.rocket;
  }

  private interval: NodeJS.Timeout;

  private async startFuelDepletion(): Promise<void> {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(async () => {
      if (this.rocket.stages[0].fuel > 0) {
        this.rocket.stages[0].fuel -= 5;
        this.rocket.altitude += 100;
        if (this.rocket.stages[0].fuel <= 0) {
          this.rocket.status = 'First Stage Separated';
          this.startSecondStageFuelDepletion();
        }
      }

      const data = JSON.stringify(this.rocket);
      await this.sendTelemetryData('http://telemetrie-service:3003/rocket/telemetrics', data);

    }, 1000);
  }

  private async startSecondStageFuelDepletion(): Promise<void> {
    clearInterval(this.interval);

    this.interval = setInterval(async () => {
      if (this.rocket.stages[1].fuel > 0) {
        this.rocket.stages[1].fuel -= 5;
        this.rocket.altitude += 100;
      } else {
        this.rocket.status = 'Mission Completed';
        clearInterval(this.interval);
      }

      const data = JSON.stringify(this.rocket);
      await this.sendTelemetryData('http://telemetrie-service:3003/rocket/telemetrics', data);

    }, 1000);
  }

  getRocket() {
    return this.rocket;
  }
}
