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

    takeOff(): any {
      const data = JSON.stringify(this.rocket);

      const sendTelemetrics = this.fetchWrapper('http://telemetrie-service:3003/rocket/telemetrics', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });

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
        if(this.rocket.stages[0].fuel > 0) {
          this.rocket.stages[0].fuel -= 5;
          if (this.rocket.stages[0].fuel <= 0) {
            //send rocket json to telemetric service          
            this.rocket.status = 'First Stage Separated';
            this.startSecondStageFuelDepletion(); 
          }
        }

        const data = JSON.stringify(this.rocket);

        const sendTelemetrics = this.fetchWrapper('http://telemetrie-service:3003/rocket/telemetrics', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: data,
        });
        
      }, 1000);
    }
    
    private startSecondStageFuelDepletion() {
      clearInterval(this.interval);  
    
      this.interval = setInterval(() => {
        // Second stage fuel depletion
        if (this.rocket.stages[1].fuel > 0) {
          this.rocket.stages[1].fuel -= 5;
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


