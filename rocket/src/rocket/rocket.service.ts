import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Rocket } from '../entities/rocket.entity';


const TARGET_ALTITUDE:number = 1_300_000;
@Injectable()
export class RocketService {
  constructor(private httpService: HttpService) {}
   
  private rocket = new Rocket('MarsY-1', 'On Ground', [
    {'id': 1,"fuel": 3000,},
    {'id': 2, "fuel": 3000,}
  ], 0, {passengers: 0, altitude: 0, status:"Grounded", speed:0, weight: 1000}, new Date().toISOString(), 0);

  async sendTelemetryData(url: string, data?: any): Promise<void> {
    // fetch post request to telemetrie service
    await this.httpService.post('http://telemetrie-service:3003/rocket/telemetrics', this.rocket).toPromise()
      .then(response => {
        console.log("Speed updated: \r");
        console.log("Rocket speed changed to: " + this.rocket.speed);
      })
      .catch(error => {
        console.error('Error sending telemetrics in fuel depletion:', error.message);
        throw error;
      });
  }

  isReady(): boolean {
    return this.rocket.payload !== null;
  }

  setPayload(payload: any): Rocket {
    this.rocket.payload = payload;
    return this.rocket;
  }

  async takeOff(): Promise<any> {
    //const data = JSON.stringify(this.rocket);

    const sendTelemetrics = await this.httpService.post('http://telemetrie-service:3003/rocket/telemetrics', this.rocket).toPromise()
    .then(response => {
      console.log("Telemetrie data sent: \r");
    })
    .catch(error => {
      console.error('Error sending telemetrics in takeoff:', error.message);
      throw error;
    });

    this.rocket.status = 'In Flight';
    console.log("Rocket status changed to: " + this.rocket.status);
    this.startFuelDepletion();
    console.log("Rocket fuel depletion started");
    // this.startSpeedIncrease();
    // console.log("Rocket speed increase started");

    return this.rocket;
  }

  private interval: NodeJS.Timeout;

  private async startFuelDepletion(): Promise<void> {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(async () => {
      if (this.rocket.stages[0].fuel > 0) {
        this.rocket.stages[0].fuel -= 50;
        if (this.rocket.stages[0].fuel <= 0) {
          this.rocket.status = 'First Stage Separated';
          this.startSecondStageFuelDepletion();
        }

        this.rocket.speed += 50; // in m/s
        this.rocket.altitude += 90; // in feet

        this.rocket.payload.altitude += 90;
        this.rocket.payload.speed += 50;


        if (this.rocket.altitude >= TARGET_ALTITUDE) {
          // Stop fuel depletion and speed increase
          clearInterval(this.interval);
          // Deploy payload
          
          await this.httpService.post('http://payload-service:3004/rocket/payload/data', this.rocket.payload).toPromise()
          this.rocket.status = 'Orbiting';
          //
        }
      }

      //TODO: implement reduce acceleration in lower atmosphere

      await this.sendTelemetryData('http://telemetrie-service:3003/rocket/telemetrics', this.rocket);
      await this.sendTelemetryData('http://payload-service:3004/rocket/payload/data', this.rocket.payload);

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

      await this.sendTelemetryData('http://telemetrie-service:3003/rocket/telemetrics', this.rocket);

    }, 1000);
  }

  getRocket() {
    return this.rocket;
  }
}
