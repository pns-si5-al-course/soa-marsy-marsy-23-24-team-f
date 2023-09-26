  import { Injectable } from '@nestjs/common';
  import { Interval } from '@nestjs/schedule';
  import * as http from 'http';


  @Injectable()
  export class RocketService {
    private rocket = {
      name: 'MarsY-1',
      status: 'On Ground',
      fuelFirstStage: 100,
      fuelSecondStage: 100,
      payload: null,
      isReady: false,
    };
    
    isReady(): boolean {
      return this.rocket.isReady;
    }

    setPayload(payload: any): any {
      this.rocket.payload = payload;
      this.rocket.isReady = true; // For simplicity, we assume that the rocket is ready to take off as soon as the payload is set. Change may be required here.
      return this.rocket;
    }

    takeOff(): any {
      this.rocket.status = 'In Flight';
      this.startFuelDepletion();

      return this.rocket;
      
    }
    private interval: NodeJS.Timeout;


    private startFuelDepletion() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    
      this.interval = setInterval(() => {
        // First stage fuel depletion
        if (this.rocket.fuelFirstStage > 0) {
          this.rocket.fuelFirstStage -= 5;
          if (this.rocket.fuelFirstStage <= 0) {
            this.rocket.status = 'First Stage Separated';
            this.startSecondStageFuelDepletion(); 
          }
        }
      }, 1000);
    }
    
    private startSecondStageFuelDepletion() {
      clearInterval(this.interval);  
    
      this.interval = setInterval(() => {
        // Second stage fuel depletion
        if (this.rocket.fuelSecondStage > 0) {
          this.rocket.fuelSecondStage -= 5;
        } else {
          this.rocket.status = 'Mission Completed';
          clearInterval(this.interval);  
        }
      }, 1000);
    }  

    getRocket(){
      return this.rocket;
    }
  }


