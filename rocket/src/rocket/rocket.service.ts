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
  };
  

  setPayload(payload: any) {
    this.rocket.payload = payload;
    return this.rocket;
  }

  takeOff() {
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

  getRocket() {
    return this.rocket;
  }
}


