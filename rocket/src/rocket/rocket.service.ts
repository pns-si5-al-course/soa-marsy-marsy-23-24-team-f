import { Inject, Injectable } from '@nestjs/common';
import { Rocket} from '../entities/rocket.entity';
import { PublisherService } from '../publisher/publisher.service';
import { ConfigService } from '@nestjs/config';


const ROCKET_INIT = new Rocket('MarsY-1', 'On Ground', [
  {'id': 1,fuel: 3000, altitude: 0, status: "On Ground", speed: 0},
  {'id': 2, fuel: 3000, altitude: 0, status: "On Ground", speed: 0}
], 0, {passengers: 0, altitude: 0, status:"Grounded", speed:0, weight: 1000}, new Date().toISOString());

const launchSequence = {
  "Rocket preparation":5, 
  "Rocket on internal power":5, 
  "Startup":60,  
  "Main engine start":3,
  "Liftoff":20,
  "MaxQ":5,
  "Main engine cut-off":3,
  "Stage separation":3,
  "Second engine start":3,
  "Fairing separation":3,
  "Second engine cut-off":3,
  "Payload deployed":3
}
@Injectable()
export class RocketService {
  private maxQ: boolean = false;
  private rocket = JSON.parse(JSON.stringify(ROCKET_INIT));
  private interval: NodeJS.Timeout;
  private sendInterval: NodeJS.Timeout;
  private stop: boolean = false;
  private separationFailure: boolean = false;

  constructor(private publisherService : PublisherService, private configService: ConfigService ) {
  }

   
  async startTransmitting(): Promise<void> {
    this.sendInterval = setInterval(async () => {
      try {
        this.pushData(this.rocket);
      } catch (error) {
        console.error(error);
      }
    }, 200);
  }

  async stopTransmitting(): Promise<void> {
    clearInterval(this.sendInterval);
  }

  async sendTelemetryData(topic:string, data?: any): Promise<void> {
    await this.publisherService.sendTelemetrics(topic, data);
  }

  pushData(rocket: Rocket){
    this.sendTelemetryData('payload.telemetrics.topic', rocket.payload);
    this.sendTelemetryData('rocket.telemetrics.topic', rocket)
  }

  isReady(): boolean {
    this.updateAccordingToSequence('Rocket preparation');
    return this.rocket.payload !== null;
  }

  setPayload(payload: any): Rocket {
    this.rocket = JSON.parse(JSON.stringify(ROCKET_INIT));
    this.rocket.payload = payload;
    this.updateAccordingToSequence('Rocket on internal power');
    this.startTransmitting();
    return this.rocket;
  }

  async sendTestData(): Promise<void> {
    const testRocket = new Rocket(
      'MarsY-1',
       'On Ground',
      [
        {
          'id': 1,
          fuel: Math.floor(Math.random() * 3000),
          altitude: Math.floor(Math.random() * 100_000),
          status: "On Ground", 
          speed: Math.floor(Math.random() * 8_000)
        },
        {
          'id': 2, 
          fuel: Math.floor(Math.random() * 3000), 
          altitude: Math.floor(Math.random() * 100_000), 
          status: "On Ground", 
          speed: Math.floor(Math.random() * 8_000)
        }
      ], 
      0, 
      {
        passengers: 0, 
        altitude: Math.floor(Math.random() * 100_000), 
        status:"Grounded", 
        speed: Math.floor(Math.random() * 8_000), 
        weight: 1000
      }, 
      new Date().toISOString())


    this.pushData(testRocket);
  }

  changeAllRocketStatus(status: string): void {
    this.rocket.status = status;
    this.rocket.payload.status = status;
    for (let stage of this.rocket.stages) {
      stage.status = status;
    }
  }

  async updateAccordingToSequence(...steps: any): Promise<Rocket> {    
    for(let key of steps){
      let time_to_wait = launchSequence[key];
      switch (key) {
        case "Liftoff":
          this.changeAllRocketStatus(key);
          break;
        case "MaxQ":
          this.changeAllRocketStatus(key);
          break;
        case "Stage separation":
          this.changeAllRocketStatus(key);
          this.rocket.stages[0].status = "Separated";
          this.firstStageSafeLanding();
          break;
        case "Payload deployed":
          this.rocket.status = key;
          this.rocket.stages[1].status = key;
          this.rocket.payload.status = "Deployed";
          break;
        default:
          this.rocket.status = key;
          break;
      }
      await this.sendTelemetryData('logs.topic', this.rocket);
      await new Promise(resolve => setTimeout(resolve, time_to_wait * 1000));
    }
    return this.rocket;
  }


  async launch(): Promise<Rocket> {
    // ------------------------------------
    // -------Sending Startup log----------
    // ------------------------------------
    this.updateAccordingToSequence('Startup');

    console.log("Rocket launched");


    // ------------------------------------
    // -------Data for rocket movement----------
    // ------------------------------------
    let lastUpdateTime = Date.now();
    let currentStageId = 0;
    const TARGET_ALTITUDE = 130_000; // pieds
    const MAX_SPEED = 8_000; // m/s
    const TOTAL_TIME = 120; // secondes
    const UPDATE_INTERVAL = 80; // 80 ms

    this.updateAccordingToSequence('Main engine start');

    const totalUpdates = (TOTAL_TIME * 1000) / UPDATE_INTERVAL;
    let altitudePerUpdate = TARGET_ALTITUDE / totalUpdates;
    
    console.log(altitudePerUpdate);

    this.updateAccordingToSequence('Liftoff');

    this.interval = setInterval(async () => {
        const now = Date.now();
        lastUpdateTime = now;

        let currentStage = this.rocket.stages[currentStageId];

        if(this.maxQ){
          altitudePerUpdate = 50;
        }

        // ------------------------------------
        // Update altitude
        // ------------------------------------
        this.rocket.altitude += altitudePerUpdate;
        this.rocket.payload.altitude = this.rocket.altitude;
        currentStage.altitude = this.rocket.payload.altitude;

        // ------------------------------------
        // Update speed
        // ------------------------------------
        this.rocket.payload.speed = altitudePerUpdate / (UPDATE_INTERVAL / 1000);
        currentStage.speed = this.rocket.payload.speed;

        // ------------------------------------
        // Update snd stage if not current
        // ------------------------------------
        if (currentStageId == 0) {
            this.rocket.stages[1].speed = this.rocket.payload.speed;
            this.rocket.stages[1].altitude = this.rocket.payload.altitude;
        }

        // ------------------------------------
        // Update fuel
        // ------------------------------------
        const estimatedFuelConsumed = altitudePerUpdate / 30; // hypothèse: 100 unités d'altitude par unité de carburant
        currentStage.fuel -= estimatedFuelConsumed;

        // ------------------------------------
        // Update status
        // ------------------------------------
        
          if (currentStage.fuel <= 150) {
            if (currentStageId == 0) {


              if (this.separationFailure){
                this.rocket.status = 'First Stage Seperation Failed';
              }else{
                this.updateAccordingToSequence('Main engine cut-off', 'Stage separation', 'Second engine start');
                currentStageId++;
              }
            } else {
               if(currentStage.fuel <= 0){
                currentStage.fuel = 0;

                currentStage.status = 'Empty';
                this.rocket.status = 'Second Stage Empty';
               }
            }

          }

        // ------------------------------------
        // Limit speed
        // ------------------------------------
        if (this.rocket.payload.speed > MAX_SPEED) {
            this.rocket.payload.speed = MAX_SPEED;
            currentStage.speed = MAX_SPEED;
        }

        if(this.rocket.payload.altitude >= TARGET_ALTITUDE){
          this.rocket.payload.altitude = TARGET_ALTITUDE;
          this.rocket.altitude = TARGET_ALTITUDE;
          currentStage.altitude = TARGET_ALTITUDE;
          altitudePerUpdate = 0;
          this.updateAccordingToSequence('Second engine cut-off', 'Payload deployed');
          clearInterval(this.interval);

        }

    }, UPDATE_INTERVAL);
    return this.rocket;
}

  async stopSimulation(): Promise<Rocket> {
    console.log("Reinitializing rocket");
    this.stopTransmitting();
    this.stop = true;
    return Promise.resolve(this.rocket);
  }


  private async firstStageSafeLanding(): Promise<void> {
    const UPDATE_INTERVAL = 80; // 80 ms
    const safeLanding = setInterval(async () => {

      let altitudePerUpdate = Math.abs(this.rocket.stages[0].speed) / 12.5; // Combien d'altitude perdre à chaque mise à jour
      if(this.rocket.stages[0].speed>0 && this.rocket.stages[0].status != 'Landing'){

        // wait for rocket inertie to be null
        this.rocket.stages[0].speed -= 100;
      } else {
        if (this.rocket.stages[0].altitude <= 500 && this.rocket.stages[0].altitude > 0) {
          // réactivation du moteur
          if(this.rocket.stages[0].status != 'Landed'){
            this.rocket.stages[0].fuel -= 20;
            this.rocket.stages[0].speed += 400;
            this.rocket.stages[0].altitude -= altitudePerUpdate / 5; // Ajuster pour une descente plus lente pendant l'atterrissages
            this.rocket.stages[0].status = 'Landing';
          }
          
        } else if (this.rocket.stages[0].altitude <= 0) {
            this.rocket.stages[0].fuel = 0;
            this.rocket.stages[0].altitude = 0;
            this.rocket.stages[0].speed = 0;
            this.rocket.stages[0].status = 'Landed';
            clearInterval(safeLanding);
        } else {
            this.rocket.stages[0].altitude -= altitudePerUpdate;
            this.rocket.stages[0].speed -= (Math.abs(this.rocket.stages[0].speed) > 2000) ? 0 : 50;
            this.rocket.stages[0].status = 'Separated';
        }
      }    
    }, UPDATE_INTERVAL);
}



  handleMaxQ(): void {
    console.log("Max Q condition detected, reducing acceleration.");
    this.maxQ = true;
    this.updateAccordingToSequence('MaxQ');
  }
  
  async takeOffWithFailure(): Promise<any> {
    this.separationFailure = true;
    this.launch();
  }

  async destroyRocket(): Promise<void> {
    if (this.interval) {
      clearInterval(this.interval);
    }
    
    this.rocket.status = 'Destroyed';
    this.rocket.payload.status = 'Destroyed';
    this.rocket.altitude = 0;
    this.rocket.payload.speed = 0;
    this.rocket.payload.altitude = 0;

    for (let stage of this.rocket.stages) {
      stage.fuel = 0;
      stage.speed = 0;
      stage.altitude = 0;
    }
  }


  getRocket() {
    return this.rocket;
  }
}
