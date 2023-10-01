import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Rocket } from '../entities/rocket.entity';


const TARGET_ALTITUDE:number = 1_300_000;
const ROCKET_INIT = new Rocket('MarsY-1', 'On Ground', [
  {'id': 1,"fuel": 3000,},
  {'id': 2, "fuel": 3000,}
], 0, {passengers: 0, altitude: 0, status:"Grounded", speed:0, weight: 1000}, new Date().toISOString(), 0);
@Injectable()
export class RocketService {
  constructor(private httpService: HttpService) {}
   
  private rocket = JSON.parse(JSON.stringify(ROCKET_INIT));
  private interval: NodeJS.Timeout;
  private stop: boolean = false;

  private separationFailure: boolean = false;


  async sendTelemetryData(url: string, data?: any): Promise<void> {
    // fetch post request to telemetrie service
    await this.httpService.post(url, data).toPromise()
      .then(_ => {
        return Promise.resolve("Telemetrics adn payload posted: \r");
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

  async takeOff(): Promise<Rocket> {
    //const data = JSON.stringify(this.rocket);
    this.rocket.payload.altitude = 0;
    this.rocket.payload.speed = 0;
    await this.sendTelemetryData('http://payload-service:3004/rocket/payload/data', this.rocket.payload);
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

    return Promise.resolve(this.rocket);
  }

  

  private async startFuelDepletion(): Promise<void> {
    if (this.interval) {
      clearInterval(this.interval);
    }
      
      this.interval = setInterval(async () => {
        if (!this.stop){
        if (this.rocket.stages[0].fuel > 0) {
          this.rocket.stages[0].fuel -= 50;
          if (this.rocket.stages[0].fuel <= 0) {
            if (!this.separationFailure){
              this.rocket.status = 'First Stage Separated';
              this.startSecondStageFuelDepletion();}
          else{
            this.rocket.status = 'First Stage Seperation Failed';
          }
          }
  
          this.rocket.speed += 50; // in m/s
          this.rocket.altitude += 90; // in feet
  
          this.rocket.payload.altitude += 90;
          this.rocket.payload.speed += 50;
  
  
          if (this.rocket.altitude >= TARGET_ALTITUDE) {
            // Stop fuel depletion and speed increase
            clearInterval(this.interval);
            // Deploy payload
            this.rocket.status = 'Orbiting';
            await this.httpService.post('http://payload-service:3004/rocket/payload/data', this.rocket.payload).toPromise()
            
            //
          }
        }} else{
          this.rocket = JSON.parse(JSON.stringify(ROCKET_INIT));
        }
        console.log("Updating telemetrics");
        //TODO: implement reduce acceleration in lower atmosphere
  
        await this.sendTelemetryData('http://telemetrie-service:3003/rocket/telemetrics', this.rocket);
        await this.sendTelemetryData('http://payload-service:3004/rocket/payload/data', this.rocket.payload);
  
      }, 1000);

    
  }

  async stopSimulation(): Promise<Rocket> {
    console.log("Reinitializing rocket");
    this.stop = true;
    await this.httpService.post('http://telemetrie-service:3003/rocket/stop-simulation').toPromise()
    return Promise.resolve(this.rocket);
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


  handleMaxQ(): Rocket {
    console.log("Max Q condition detected, reducing speed.");
    this.rocket.speed -= 100;
    this.sendTelemetryData('http://telemetrie-service:3003/rocket/telemetrics', this.rocket);
    return this.rocket;
  }
  
async takeOffWithFailure(): Promise<any> {
  this.separationFailure = true;
  this.takeOff();
}

async destroyRocket(): Promise<void> {
  if (this.interval) {
    clearInterval(this.interval);
  }
  
  this.rocket.status = 'Destroyed';
  this.rocket.speed = 0;
  this.rocket.altitude = 0;
  this.rocket.payload.speed = 0;
  this.rocket.payload.altitude = 0;

  for (let stage of this.rocket.stages) {
    stage.fuel = 0;
  }

  await this.sendTelemetryData('http://telemetrie-service:3003/rocket/telemetrics', this.rocket);
}


  getRocket() {
    return this.rocket;
  }
}
