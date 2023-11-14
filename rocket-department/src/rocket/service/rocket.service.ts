import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
@Injectable()
export class RocketService {
  private isWatchingRocketData = false;

  constructor(
    private httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  // FIXME: NOT WORKING WITH STATELESS ROCKET
  async launchRocket(): Promise<any> {
    console.log("TAKEOFF PERMISSION \r")
    try {
      const rocketReadyResponse = await this.httpService.get('http://rocket-object-service:3005/rocket/isReady').toPromise()
      .then((response: { data: any; }) => {
        console.log("Rocket responded it is ready for launch: \r");
        return response.data;
      });
      //isRocketReady = true;

      if (!rocketReadyResponse.ok !== true) {
        throw new Error('Rocket is not ready for launch');
      }

      const launchResponse = await this.httpService.post('http://rocket-object-service:3005/rocket/takeoff').toPromise()
      .then((response: { data: any; }) => {
        console.log("Rocket launched: \r");
        return response.data;
      })
      .catch((error: { message: any; }) => {
        console.error('Error sending launch order to rocket:', error.message);
        throw error;
      });
      
      if (launchResponse) {
        this.startWatchingRocketData();
        return { status: 'Rocket launched' };
      } else {
        return { status: "ROCKET LAUNCH ABORTED" };
      }

    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  // FIXME: NOT WORKING WITH STATELESS ROCKET
  async launchRocketWithFailure(): Promise<any> {
    try {
      const rocketReadyResponse = await this.httpService.get('http://rocket-object-service:3005/rocket/isReady').toPromise()
      .then((response: { data: any; }) => {
        console.log("Rocket responded it is ready for launch: \r");
        return response.data;
      });
      //isRocketReady = true;

      if (!rocketReadyResponse.ok !== true) {
        throw new Error('Rocket is not ready for launch');
      }

      const launchResponse = await this.httpService.post('http://rocket-object-service:3005/rocket/takeoffwithfailure').toPromise()
      .then((response: { data: any; }) => {
        console.log("Rocket launched: \r");
        return response.data;
      })
      .catch((error: { message: any; }) => {
        console.error('Error sending launch order to rocket:', error.message);
        throw error;
      });
      
      if (launchResponse) {
        this.startWatchingRocketData();
        return { status: 'Rocket launched' };
      } else {
        return { status: "ROCKET LAUNCH ABORTED" };
      }

    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  // OK
  async loadRocket(): Promise<any> {
    const rocket = await this.httpService.get('http://rocket-object-service:3005/rocket/example').toPromise()
          .then((response: { data: any; }) => {
            console.log("Rocket example fetched: \r");
            return response.data;
          })
          .catch((error: { message: any; }) => {})
    try {
      const response = await this.httpService.get('http://payload-service:3004/rocket').toPromise()
      .then(async (response: { status: number; data: any; }) => {
        console.log("------------------------");
        if (response.status === 200) {
          console.log(response.data);
          const payloadData = response.data;
          rocket.payload= payloadData;
          const setPayloadResponse = await this.httpService.post('http://rocket-object-service:3005/rocket/setpayload', rocket).toPromise()
          .then((res: { status: number; }) => {
            if (res.status === 201) {
              console.log("Payload set in rocket: \r");
            } else {
              throw new Error('Failed to set payload in the rocket');
            }
          });
        } else {
          throw new Error('Failed to fetch rocket data');
        }
      });
      //await this.httpService.post('http://telemetrie-service:3003/rocket/start-simulation').toPromise()
      
    } catch (error) {
      console.error('Error processing rocket payload:', error);
      throw new Error('Rocket payload processing failed');
    }
  }

  // FIXME: Statefull implemantation
  startWatchingRocketData(): void {
    if (!this.isWatchingRocketData) {
      const callback = this.watchRocketData.bind(this);
      const interval = setInterval(callback, 1000);
      this.schedulerRegistry.addInterval('rocketDataCheck', interval);
      this.isWatchingRocketData = true;
    }
  }
  
  // FIXME: Statefull implemantation
  stopWatchingRocketData(): void {
    if (this.isWatchingRocketData) {
      const interval = this.schedulerRegistry.getInterval('rocketDataCheck');
      clearInterval(interval);
      this.schedulerRegistry.deleteInterval('rocketDataCheck');
      this.isWatchingRocketData = false;
    }
  }

  // FIXME: Statefull implemantation
  async watchRocketData(): Promise<void> {

    let rocketData : any;

    try {
      rocketData = await this.askTelemetrieForRocketData();
      console.log("Rocket data: " + JSON.stringify(rocketData));
    } catch (error) {
      console.error('Error in watchRocketData when fetching data:', error.message);
      return;
    }

    if (rocketData.altitude >= 40_000 && !this.isMaxQ) {
      console.log("Rocket has reached maxQ !");
      try {
        const maxQResponse = await this.httpService.post('http://rocket-object-service:3005/rocket/MaxQ').toPromise();
        if (maxQResponse.status === 200) {
          console.log("MaxQ data sent successfully");
        } else {
          console.log("Failed to send maxQ data");
        }
      } catch (error) {
        console.error('Error sending maxQ data:', error.message);
      }
      this.isMaxQ = true;
    }

    if (rocketData.status === 'First Stage Seperation Failed') {
      console.log("Send failure to mission commander: \r");

      //post the rocket.status to mission commander
      this.httpService.post('http://mission-commander-service:3006/rocket/failure', { status: rocketData.status }).toPromise()
      .then(() => {
        console.log("Failure sent to mission commander: \r");
      })
      .catch((error: { message: any; }) => {
        console.error('Error sending failure to mission commander:', error.message);
      });
      

      //Doing this until the route is implemented
      rocketData.status = 'Destroyed';
    }
  
    //else if (rocketData.status === 'Destroyed') {
    if (rocketData.status === 'Destroyed') {
      this.stopWatchingRocketData();
    }
    else if (rocketData.message === 'Mission Completed') {
      this.stopWatchingRocketData();
    }
    

  }

  // OK
  async askTelemetrieForRocketData(): Promise<any> {
      try {
        const response = await this.httpService.get('http://telemetrie-service:3003/rocket/telemetrics').toPromise();
        console.log("Rocket status fetched: \r");
        return response.data;
      } catch (error) {
        console.error('Error fetching rocket status:', error.message);
      }
  }

  onModuleDestroy() {
    this.stopWatchingRocketData();
  }
}
