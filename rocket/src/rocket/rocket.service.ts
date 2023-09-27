import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Rocket } from '../entities/rocket.entity';

@Injectable()
export class RocketService {
  constructor(private httpService: HttpService) {}
  private rocket = new Rocket('MarsY-1', 'On Ground', [
    {'id': 1,"fuel": 30,},
    {'id': 2, "fuel": 300,}
  ], 0, null, new Date().toISOString(), 0);

  async sendTelemetryData(url: string, data?: any): Promise<any> {
    // fetch post request to telemetrie service
    const response = await this.httpService.post(url, data).toPromise();
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

  private async startSpeedIncrease(): Promise<void> {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(async () => {
      if (this.rocket.speed < 10000) {
        this.rocket.speed += 1000;
        this.rocket.altitude += 1000;
        if (this.rocket.speed >= 10000) {
          this.rocket.status = 'Orbiting';
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
