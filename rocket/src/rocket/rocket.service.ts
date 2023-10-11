import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Rocket} from '../entities/rocket.entity';
import { PublisherService } from '../publisher/publisher.service';
import { ConfigService } from '@nestjs/config';



const TARGET_ALTITUDE:number = 130_000;
const MAX_SPEED:number = 7700;
const ACCELERATION = 10; // m/s^2 (hypothétique)
const ROCKET_INIT = new Rocket('MarsY-1', 'On Ground', [
  {'id': 1,fuel: 3000, altitude: 0, status: "On Ground", speed: 0},
  {'id': 2, fuel: 3000, altitude: 0, status: "On Ground", speed: 0}
], 0, {passengers: 0, altitude: 0, status:"Grounded", speed:0, weight: 1000}, new Date().toISOString());
@Injectable()
export class RocketService {
  constructor(private publisherService : PublisherService, private configService: ConfigService ) {}
   
  private rocket = JSON.parse(JSON.stringify(ROCKET_INIT));
  private interval: NodeJS.Timeout;
  private stop: boolean = false;



  private separationFailure: boolean = false;


  async sendTelemetryData(topic:string, data?: any): Promise<void> {
    await this.publisherService.sendTelemetrics(topic, data);
  }

  pushData(rocket: Rocket){
    console.log("Pushing data to kafka");
    this.sendTelemetryData('payload.telemetrics.topic', rocket.payload);
    this.sendTelemetryData('rocket.telemetrics.topic', rocket)
  }

  isReady(): boolean {
    return this.rocket.payload !== null;
  }

  setPayload(payload: any): Rocket {
    this.rocket = JSON.parse(JSON.stringify(ROCKET_INIT));
    this.rocket.payload = payload;
    return this.rocket;
  }


  async launch(): Promise<Rocket> {
    let time = 0; // en secondes
    let deltaTime = 1; // intervalle de temps pour chaque itération
    let currentStageId = 0;

    this.rocket.status = 'In Flight';
    this.rocket.payload.status = 'In Flight';
    this.rocket.stages[0].status = 'In Flight';
    this.rocket.stages[1].status = 'In Flight';

    this.pushData(this.rocket);

    this.interval = setInterval(async () => {
      // Consommer du carburant de l'étage actuel

      if (this.rocket.payload.altitude > TARGET_ALTITUDE || this.rocket.payload.speed > MAX_SPEED) {
        clearInterval(this.interval);
      }
      let currentStage = this.rocket.stages[currentStageId];
      if (currentStage.fuel > 0) {
        const fuelConsumed = Math.min(currentStage.fuel, ACCELERATION * deltaTime);
        currentStage.fuel -= fuelConsumed;

        // Augmenter la vitesse et l'altitude
        const deltaSpeed = (ACCELERATION * deltaTime) * (fuelConsumed / ACCELERATION);
        this.rocket.payload.speed += deltaSpeed;
        this.rocket.payload.altitude += this.rocket.payload.speed * deltaTime + 0.5 * deltaSpeed * deltaTime * deltaTime;

        currentStage.altitude = this.rocket.payload.altitude;
        this.rocket.altitude = this.rocket.payload.altitude;
        this.rocket.speed = this.rocket.payload.speed;
        currentStage.speed = this.rocket.payload.speed;

        if (currentStageId == 0){
          this.rocket.stages[1].speed = this.rocket.payload.speed; 
        }
        

        // Mettre à jour le statut de l'étage
        if (currentStage.fuel <= 0) {
          currentStage.status = 'Separated';
          this.rocket.status = 'First Stage Separated';
          currentStageId++;
          this.startSecondStageFuelDepletion();
        }
      } else {
        // Si nous n'avons plus de carburant, arrêter d'accélérer
        this.rocket.payload.altitude += this.rocket.payload.speed * deltaTime;
        this.rocket.altitude = this.rocket.payload.altitude;
        currentStage.altitude = this.rocket.payload.altitude;
      }

      // Limiter la vitesse à la vitesse maximale
      if (this.rocket.payload.speed > MAX_SPEED) {
        this.rocket.payload.speed = MAX_SPEED;
        this.rocket.speed = MAX_SPEED;
      }

      time += deltaTime;

      this.pushData(this.rocket);
    }, this.configService.get('interval'));

    this.rocket.payload.status = this.rocket.payload.altitude >= TARGET_ALTITUDE ? 'Orbiting' : 'Suborbital';
    return this.rocket;
  }

  async takeOff(): Promise<Rocket> {
    try {
      this.pushData(this.rocket);
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

    this.pushData(this.rocket)

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
        this.pushData(this.rocket)
      }, this.configService.get('interval'));

    
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
      this.pushData(this.rocket)
    }, this.configService.get('interval'));
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
      this.pushData(this.rocket)
    }, this.configService.get('interval'));
  }


  async handleMaxQ(): Promise<Rocket> {
    console.log("Max Q condition detected, reducing speed.");
    this.rocket.stages[1].speed -= 100;
    this.pushData(this.rocket)
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

  this.pushData(this.rocket)
}


  getRocket() {
    return this.rocket;
  }
}
