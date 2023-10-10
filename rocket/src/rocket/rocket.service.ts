import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Rocket} from '../entities/rocket.entity';
import { PublisherService } from '../publisher/publisher.service';


const TARGET_ALTITUDE:number = 130_000;
const ROCKET_INIT = new Rocket('MarsY-1', 'On Ground', [
  {'id': 1,fuel: 3000, altitude: 0, status: "On Ground", speed: 0},
  {'id': 2, fuel: 3000, altitude: 0, status: "On Ground", speed: 0}
], 0, {passengers: 0, altitude: 0, status:"Grounded", speed:0, weight: 1000}, new Date().toISOString());
@Injectable()
export class RocketService {
  constructor(private publisherService : PublisherService) {}
   
  private rocket = JSON.parse(JSON.stringify(ROCKET_INIT));
  private interval: NodeJS.Timeout;
  private stop: boolean = false;

  private separationFailure: boolean = false;

  async sendTelemetryData(topic:string, data?: any): Promise<void> {
    await this.publisherService.sendTelemetrics(topic, data);
  }

  pushData(){
    console.log("Pushing data to kafka");
    this.sendTelemetryData('payload.telemetrics.topic', this.rocket.payload);
    this.sendTelemetryData('rocket.telemetrics.topic', this.rocket)
  }

  isReady(): boolean {
    return this.rocket.payload !== null;
  }

  setPayload(payload: any): Rocket {
    this.rocket.payload = payload;
    return this.rocket;
  }

  async takeOff(): Promise<Rocket> {
    this.rocket = JSON.parse(JSON.stringify(ROCKET_INIT));
    try {
      this.pushData();
    } catch (error) {
      console.error(error);
      throw error;
    }

    this.stop = false;

    this.rocket.status = 'In Flight';
    this.rocket.payload.status = 'In Flight';
    this.rocket.stages[0].status = 'In Flight';
    this.rocket.stages[1].status = 'In Flight';
    console.log("Rocket status changed to: " + this.rocket.status);
    this.startFuelDepletion();
    console.log("Rocket fuel depletion started");

    return Promise.resolve(this.rocket);
  }

  

  private async startFuelDepletion(): Promise<void> {
    if (this.interval) {
      clearInterval(this.interval);
    }
      
      this.interval = setInterval(async () => {
        if (this.stop){
          clearInterval(this.interval);
        }
        if (this.rocket.stages[0].fuel > 100) {
          this.rocket.stages[0].fuel -= 50;
          if (this.rocket.stages[0].fuel <= 100) {
            if (!this.separationFailure){
              this.rocket.status = 'First Stage Separated';
              this.rocket.stages[0].status = 'Separated';
              this.startSecondStageFuelDepletion();}
            else{
              this.rocket.status = 'First Stage Seperation Failed';
            }
          }
  
          this.rocket.stages[1].speed += (this.rocket.stages[1].speed<7700)? 500: 0; // in m/s
          this.rocket.stages[0].speed = this.rocket.stages[1].speed;
          this.rocket.payload.speed += (this.rocket.payload.speed<7700)? 500: 0;;

          this.rocket.altitude += 1096; // in feet
          this.rocket.payload.altitude += 1096;

          switch (this.rocket.stages[0].status) {
            case 'In Flight':
              this.rocket.stages[0].altitude += 1096;
              break;
            case 'Max Q':
              //TODO: implement reduce acceleration in lower atmosphere
              break;
            case 'Separated':
              this.rocket.stages[0].altitude += 0;
              break;
            case 'Landing':
              this.rocket.stages[0].altitude += 0;
              break;
            default:
              break;
          }
          
          this.rocket.stages[1].altitude += 1096;
        }
        console.log("Updating telemetrics");
        //TODO: implement reduce acceleration in lower atmosphere
  
        await this.pushData();
  
      }, 1000);

    
  }

  async stopSimulation(): Promise<Rocket> {
    console.log("Reinitializing rocket");
    this.stop = true;
    return Promise.resolve(this.rocket);
  }

  private async firstStageSafeLanding(): Promise<void> {
    // we let the rocket fall down to 500m
    // then we start the landing procedure
    const safeLanding = setInterval(async () => {
      if (this.rocket.stages[0].altitude <= 500 && this.rocket.stages[0].altitude > 0) {
        // reactivating the engine
        this.rocket.stages[0].fuel -= 20;
        this.rocket.stages[0].altitude -= 100;
        this.rocket.stages[0].speed -= 1500;
        this.rocket.stages[0].status = 'Landing';
      } else if (this.rocket.stages[0].altitude <= 0) {
        this.rocket.stages[0].altitude = 0;
        this.rocket.stages[0].speed = 0;
        this.rocket.stages[0].status = 'Landed';
        clearInterval(safeLanding);
      } else {
        this.rocket.stages[0].altitude -= 1500;
        this.rocket.stages[0].speed -= (this.rocket.stages[0].speed > 12000) ? 0 : 1000;
        this.rocket.stages[0].status = 'Separated'
      }
    }, 1000);
  }

  private async startSecondStageFuelDepletion(): Promise<void> {
    this.firstStageSafeLanding();

    clearInterval(this.interval);

    this.interval = setInterval(async () => {
      if(this.stop){
        clearInterval(this.interval);
      }
      if (this.rocket.stages[1].fuel > 0) {
        this.rocket.stages[1].fuel -= 40;

        this.rocket.stages[1].speed += (this.rocket.stages[1].speed<7700)? 500: 0; // in m/s
        this.rocket.payload.speed += (this.rocket.payload.speed<7700)? 500: 0;;

        this.rocket.altitude += 1096; // in feet
        this.rocket.payload.altitude += 1096;
        this.rocket.stages[1].altitude += 1096;
  
        if (this.rocket.altitude >= TARGET_ALTITUDE) {
          // Deploy payload
          this.rocket.status = 'Orbiting';
          this.rocket.payload.status = 'Deployed';
          
          // Stop fuel depletion and speed increase
          clearInterval(this.interval);
          //
        }

      } else {
        clearInterval(this.interval);
      }

     this.pushData();

    }, 1000);
  }


  async handleMaxQ(): Promise<Rocket> {
    console.log("Max Q condition detected, reducing speed.");
    this.rocket.stages[1].speed -= 100;
    await this.pushData();
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
  this.rocket.payload.status = 'Destroyed';
  this.rocket.stages[0].speed = 0;
  this.rocket.stages[1].speed = 0;
  this.rocket.altitude = 0;
  this.rocket.payload.speed = 0;
  this.rocket.payload.altitude = 0;

  for (let stage of this.rocket.stages) {
    stage.fuel = 0;
  }

  await this.pushData();
}


  getRocket() {
    return this.rocket;
  }
}
