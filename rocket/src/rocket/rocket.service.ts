  import { Injectable } from '@nestjs/common';
  import { Interval } from '@nestjs/schedule';
  import * as http from 'http';


  @Injectable()
  export class RocketService {
    private rocket = {
      name: 'MarsY-1',
      status: 'On Ground',
      stages: [
        {
          'id' : 1,
          "fuel": 30,
        },
        {
          'id' : 2,
          "fuel": 300,
        }
      ],
      payload: null,
      timestamp: new Date().toISOString(),
    };

    async fetchWrapper(url: string, options?: any): Promise<any> {
      const { default: fetchFunction } = await import('node-fetch');
      return fetchFunction(url, options);
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

      const sendTelemetrics = await this.fetchWrapper('http://telemetrie-service:3003/rocket/telemetrics', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });

      console.log(sendTelemetrics);
      this.rocket.status = 'In Flight';
      this.startFuelDepletion();

      return this.rocket
      
    }
    private interval: NodeJS.Timeout;


    private async startFuelDepletion(): Promise<void> {
      if (this.interval) {
        clearInterval(this.interval);
      } 
    
      this.interval = setInterval(async () => {
        // First stage fuel depletion
        if(this.rocket.stages[0].fuel > 0) {
          this.rocket.stages[0].fuel -= 5;
          if (this.rocket.stages[0].fuel <= 0) {
            //send rocket json to telemetric service          
            this.rocket.status = 'First Stage Separated';
            this.startSecondStageFuelDepletion(); 
          }
        }

        const data = JSON.stringify(this.rocket);

        const sendTelemetrics = await this.fetchWrapper('http://telemetrie-service:3003/rocket/telemetrics', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: data,
        });

      }, 1000);
    }
    
    private async startSecondStageFuelDepletion(): Promise<void> {
      clearInterval(this.interval);  
    
      this.interval = setInterval(async () => {
        // Second stage fuel depletion
        if (this.rocket.stages[1].fuel > 0) {
          this.rocket.stages[1].fuel -= 5;
        } else {
          this.rocket.status = 'Mission Completed';
          clearInterval(this.interval);  
        }
        const data = JSON.stringify(this.rocket);

        const sendTelemetrics = await this.fetchWrapper('http://telemetrie-service:3003/rocket/telemetrics', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: data,
        });

      }, 1000);
    }  

    getRocket(){
      return this.rocket;
    }
  }


