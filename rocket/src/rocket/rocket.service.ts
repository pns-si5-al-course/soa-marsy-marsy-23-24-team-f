// import { Inject, Injectable } from '@nestjs/common';
// import { Rocket} from '../entities/rocket.entity';
// import { RocketSimulation } from '../entities/rocket.simulation.entity';
// import { LaunchSequenceDurations, LaunchSequenceStatus } from '../entities/launch.sequence.entity';
// import { PublisherService } from '../publisher/publisher.service';
// import { ConfigService } from '@nestjs/config';
// import { clear } from 'console';
// import { EventEmitter } from 'events';



// const ROCKET_INIT = new Rocket('MarsY-1', 'On Ground', [
//   {'id': 1,fuel: 3000, altitude: 0, status: "On Ground", speed: 0, v0: 0, a: 0},
//   {'id': 2, fuel: 3000, altitude: 0, status: "On Ground", speed: 0, v0: 0, a: 0}
// ], 0, {passengers: 0, altitude: 0, status:"Grounded", speed:0, weight: 1000}, 
// new Date().toISOString(),
// 0,
// 0,
// 1000+1000,
// 0
// );

// const landingSequence = {
//   "Flip maneuver": 3,  
//   "Entry burn":5,
//   "Guidance": 5, 
//   "Landing burn": 5,  
//   "Landing legs deployed": 5,
//   "Landing":3
// }
// @Injectable()
// export class RocketService {
//   private maxQ: boolean = false;
//   private rocket = JSON.parse(JSON.stringify(ROCKET_INIT));
//   private interval: NodeJS.Timeout;
//   private sendInterval: NodeJS.Timeout;
//   private stop: boolean = false;
//   private separationFailure: boolean = false;
//   private eventEmitter: EventEmitter = new EventEmitter();
//   private rocketSim = new RocketSimulation();

//   constructor(private publisherService : PublisherService, private configService: ConfigService ) {
//   }

//   reinitializeRocket(): void {
//     for (let prop in this.rocket) {
//       if (this.rocket.hasOwnProperty(prop)) {
//           delete this.rocket[prop];
//       }
//     }
//     this.rocket = null;
//     this.rocket = JSON.parse(JSON.stringify(ROCKET_INIT));

//     this.maxQ = false;
//     this.stop = false;
//     this.separationFailure = false;

//     if (this.interval) {
//       clearInterval(this.interval);
//     }
//   }
   
//   async startTransmitting(): Promise<void> {
//     this.sendInterval = setInterval(async () => {
//       try {
//         this.pushData(this.rocket);
//       } catch (error) {
//         console.error(error);
//       }
//     }, 200);
//   }

//   async stopTransmitting(): Promise<void> {
//     clearInterval(this.sendInterval);
//   }

//   async sendTelemetryData(topic:string, data?: any): Promise<void> {
//     await this.publisherService.sendTelemetrics(topic, data);
//   }

//   pushData(rocket: Rocket){
//     this.sendTelemetryData('payload.telemetrics.topic', rocket.payload);
//     this.sendTelemetryData('rocket.telemetrics.topic', rocket)
//     this.sendTelemetryData('logs.topic', rocket);
//   }

//   isReady(): boolean {
//     this.eventEmitter.on('step', (key) => {
//       this.updateAccordingToSequence(key);
//     })
//     this.eventEmitter.on('landingStep', (key) => {
//       this.updateFirstStageAccordingToSequence(key);
//     })
//     return this.rocket.payload !== null;
//   }

//   async setPayload(payload: any): Promise<Rocket> {
//     this.rocket = JSON.parse(JSON.stringify(ROCKET_INIT));
//     this.rocket.payload = payload;
//     this.startTransmitting();
//     await this.emitEvent('Rocket preparation');
//     await this.emitEvent('Rocket on internal power');
//     return this.rocket;
//   }

//   changeAllRocketStatus(status: string): void {
//     this.rocket.status = status;
//     this.rocket.payload.status = status;
//     this.rocket.stages[1].status = status;
//   }

//   updateFirstStageAccordingToSequence(key: string): void {
//     switch (key) {
//       case "Flip maneuver":
//       case "Entry burn":
//       case "Guidance":
//       case "Landing burn":
//       case "Landing legs deployed":
//       case "Landing":
//         this.rocket.stages[0].status = key;
//         break;
//       default:
//         break;
//     }
//   }


//   updateAccordingToSequence(key: string): void {    
//       switch (key) {
//         case "Rocket preparation":
//         case "Rocket on internal power":
//         case "Startup":
//         case "Main engine start":
//         case "Main engine cut-off":
//           this.changeAllRocketStatus(key);
//           break;
//         case "Liftoff":  
//           this.rocketSim.setAcceleration(11.77);
//           this.changeAllRocketStatus(key);
//           break;
//         case "In flight":
//           this.rocketSim.setAcceleration(29.43);
//           this.changeAllRocketStatus(key);
//           break;
//         case "Stage separation":
//           this.changeAllRocketStatus(key);
//           this.rocket.stages[0].status = "Separated";
//           this.firstStageSafeLanding();
//           //await new Promise(resolve => setTimeout(resolve, time_to_wait * 1000));
//           break;
//         case "MaxQ":
//           this.rocket.status = key;
//           this.rocket.stages[0].status = key;
//           this.rocketSim.setAcceleration(24.53);
//           break;
//         case "Second engine start":
//         case "Fairing separation":
//         case "Second engine cut-off":
//           this.rocket.status = key;
//           this.rocket.payload.status = key;
//           //await new Promise(resolve => setTimeout(resolve, time_to_wait * 1000));
//           break;          
//         case "Payload deployed":
//           this.rocket.status = key;
//           this.rocket.stages[1].status = key;
//           this.rocket.payload.status = "Deployed";
//           this.rocketSim.setAcceleration(0);
//           break;
//         case "First Stage Separation Failed":
//           this.rocket.status = "CRITICAL FAILURE";
//           this.rocket.stages[0].status = key;
//           // trigger auto destruction
//           this.destroyRocket();
//           this.stopTransmitting();
//           break;
//         case "Wrong orbit":
//           this.rocket.status = key;
//           this.rocket.payload.status = key;
          
//           break;
//         default:
//           this.rocket.status = key;
//           break;
//       }
//   }

//   async emitEvent(key: string, eName: string = 'step'): Promise<void> {
//     this.eventEmitter.emit(eName, key);
//     await new Promise(resolve => setTimeout(resolve, LaunchSequenceDurations[LaunchSequenceStatus[key]] * 1000));
//   }


//   async launch(): Promise<Rocket> {
//     let rocket_t = 0;
//     let clearGround = false;
//     // ------------------------------------
//     // -------Sending Startup log----------
//     // ------------------------------------
//     await this.emitEvent('Startup');

//     // ------------------------------------
//     // -------Data for rocket movement----------
//     // ------------------------------------
//     let currentStageId = 0;
//     const TARGET_ALTITUDE = 130_000; // pieds
//     const MAX_SPEED = 8_000; // m/s
//     const TOTAL_TIME = 120; // secondes
//     const UPDATE_INTERVAL = 80; // 80 ms

//     const totalUpdates = (TOTAL_TIME * 1000) / UPDATE_INTERVAL;
//     let altitudePerUpdate = 120;
//     //TARGET_ALTITUDE / totalUpdates;


  
//     await this.emitEvent('Main engine start');
//     await this.emitEvent('Liftoff');
    

//     this.interval = setInterval(async () => {
//         let currentStage = this.rocket.stages[currentStageId];


//         if (this.rocket.altitude > 100 && !clearGround){
//           this.emitEvent('In flight');
//           clearGround = true;
//         }
//         // ------------------------------------
//         // Update altitude
//         // ------------------------------------
//         this.rocket.altitude = this.rocketSim.positionAt(rocket_t/1000);
//         this.rocket.payload.altitude = this.rocket.altitude;
//         currentStage.altitude = this.rocket.payload.altitude;

//         // ------------------------------------
//         // Update speed
//         // ------------------------------------
//         this.rocket.payload.speed = this.rocketSim.velocityAt(rocket_t/1000);
//         currentStage.speed = this.rocket.payload.speed;

//         // ------------------------------------
//         // Update snd stage if not current
//         // ------------------------------------
//         if (currentStageId == 0) {
//             this.rocket.stages[1].speed = this.rocket.payload.speed;
//             this.rocket.stages[1].altitude = this.rocket.payload.altitude;
//         }

//         // ------------------------------------
//         // Update fuel
//         // ------------------------------------
//         const estimatedFuelConsumed = altitudePerUpdate / 30; 
//         currentStage.fuel -= estimatedFuelConsumed;

        
//           if (currentStage.fuel <= 400) {
//             if (currentStageId == 0) {
//               if (this.separationFailure){
//                 await this.emitEvent('First Stage Separation Failed')
//                 this.rocket.status = 'First Stage Separation Failed';
//               }else{
//                 await this.emitEvent('Stage separation')
//                 this.emitEvent('Second engine start');
//                 currentStageId = 1;
//               }
//             } else {
//                if(currentStage.fuel <= 0){
//                 currentStage.fuel = 0;
//                 clearInterval(this.interval);
//                 if(this.rocket.payload.altitude < TARGET_ALTITUDE){
//                   await this.emitEvent('Wrong orbit');
//                 }
//                }
//             }

//           }

//         if(this.rocket.payload.altitude >= TARGET_ALTITUDE){
//           this.rocket.payload.altitude = TARGET_ALTITUDE;
//           this.rocket.altitude = TARGET_ALTITUDE;
//           currentStage.altitude = TARGET_ALTITUDE;
//           altitudePerUpdate = 0;
//           await this.emitEvent('Fairing separation')
//           await this.emitEvent('Second engine cut-off')
//           await this.emitEvent('Payload deployed');
//           clearInterval(this.interval);
//         }
//         rocket_t += UPDATE_INTERVAL;
//     }, UPDATE_INTERVAL);
//     return this.rocket;
// }

//   async stopSimulation(): Promise<Rocket> {
//     console.log("Reinitializing rocket");
//     this.stopTransmitting();
//     this.reinitializeRocket();
//     console.log("Rocket reinitialized successfully");
//     this.stop = true;
//     return Promise.resolve(this.rocket);
//   }


//   private async firstStageSafeLanding(): Promise<void> {
//     let booster_t = 0;
//     const UPDATE_INTERVAL = 80; // 80 ms
//     const rocket_sim2 = new RocketSimulation(this.rocket.stages[0].altitude, Math.abs(this.rocket.stages[0].speed), -9.8);
    
//     await this.emitEvent('Flip maneuver', 'landingStep');

//     const safeLanding = setInterval(async () => {
//         if(this.rocket.stages[0].speed > 0 && this.rocket.altitude > 30000) {
//             // Attendez que l'inertie de la fusée soit nulle
//             rocket_sim2.setAcceleration(-29.4); // -3g
//         } else if (this.rocket.stages[0].altitude <= 500 && this.rocket.stages[0].altitude > 0 && this.rocket.stages[0].status !== 'Landed') {
//             // réactivation du moteur
//             rocket_sim2.setAcceleration(-9.8); // considérant qu'il combat la gravité
//             this.rocket.stages[0].fuel -= 20;
//             await this.emitEvent('Landing burn', 'landingStep');
//         } else if (this.rocket.stages[0].altitude <= 0) {
//             // Atterri
//             this.rocket.stages[0].fuel = 0;
//             this.rocket.stages[0].altitude = 0;
//             this.rocket.stages[0].speed = 0;
//             clearInterval(safeLanding);
//             await this.emitEvent('Landing legs deployed', 'landingStep');
//             await this.emitEvent('Landing', 'landingStep');
//             await this.emitEvent('Landed', 'landingStep');
//         } else {
//             // chute libre
//             rocket_sim2.setAcceleration(9.8); // gravité
//         }

//         // Mise à jour de la vitesse et de la position de la fusée
//         this.rocket.stages[0].speed = rocket_sim2.velocityAt(booster_t/1000);
//         this.rocket.stages[0].altitude = rocket_sim2.positionAt(booster_t/1000);
      
//         booster_t += UPDATE_INTERVAL;
//     }, UPDATE_INTERVAL);
// }



//   async handleMaxQ(): Promise<void> {
//     console.log("Max Q condition detected, reducing acceleration.");
//     this.maxQ = true;
//     await this.emitEvent('MaxQ');
//   }
  
//   async takeOffWithFailure(): Promise<any> {
//     this.separationFailure = true;
//     this.launch();
//   }

//   async destroyRocket(): Promise<void> {
//     if (this.interval) {
//       clearInterval(this.interval);
//     }
    
//     this.rocket.status = 'Destroyed';
//     this.rocket.payload.status = 'Destroyed';
//     this.rocket.altitude = 0;
//     this.rocket.payload.speed = 0;
//     this.rocket.payload.altitude = 0;

//     for (let stage of this.rocket.stages) {
//       stage.fuel = 0;
//       stage.speed = 0;
//       stage.altitude = 0;
//     }
//   }


//   getRocket() {
//     return this.rocket;
//   }

//   async getFuelConsumptionBySeconds(stage_id: number): Promise<number> {
//     const startValue = this.rocket.stages[stage_id].fuel;
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     const endValue = this.rocket.stages[stage_id].fuel;
//     return startValue - endValue;
//   }

//   async getMetterPerSecond(rocket_part: any=this.rocket): Promise<number> {
//     const startValue = rocket_part.altitude;
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     const endValue = rocket_part.altitude;
//     return startValue - endValue;
//   }


//   async fuelLeak(): Promise<void> {
//     this.rocket.stages[0].fuel -= 400;
//     this.rocket.stages[1].fuel -= 200;
//   }
// }
