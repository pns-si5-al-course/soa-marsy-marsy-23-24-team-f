import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
@Injectable()
export class RocketService {

  constructor(
    private httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  async launchRocket(): Promise<any> {
    try {
      const rocketReadyResponse = await this.httpService.get('http://rocket-object-service:3005/rocket/isReady').toPromise()
      .then(response => {
        console.log("Rocket responded it is ready for launch: \r");
        return response.data;
      });
      //isRocketReady = true;

      if (!rocketReadyResponse.ok !== true) {
        throw new Error('Rocket is not ready for launch');
      }

      const launchResponse = await this.httpService.post('http://rocket-object-service:3005/rocket/takeoff').toPromise()
      .then(response => {
        console.log("Rocket launched: \r");
        return response.data;
      })
      .catch(error => {
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

  async loadRocket(): Promise<any> {
    try {
      const response = await this.httpService.get('http://payload-service:3004/rocket').toPromise()
      .then(async response => {
        console.log("------------------------");
        if (response.status === 200) {
          const payloadData = response.data;
          const setPayloadResponse = await this.httpService.post('http://rocket-object-service:3005/rocket/setpayload', JSON.stringify(payloadData)).toPromise()
          .then(res => {
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
      
    } catch (error) {
      console.error('Error processing rocket payload:', error);
      throw new Error('Rocket payload processing failed');
    }
  }

  startWatchingRocketData(): void {
    const callback = this.watchRocketData.bind(this);
    const interval = setInterval(callback, 1000);
    this.schedulerRegistry.addInterval('rocketDataCheck', interval);
  }

  stopWatchingRocketData(): void {
    const interval = this.schedulerRegistry.getInterval('rocketDataCheck');
    clearInterval(interval);
  }

  async watchRocketData(): Promise<void> {

    let rocketData : any;

    try {
      rocketData = await this.askTelemetrieForRocketData();
      console.log("Rocket data: " + JSON.stringify(rocketData));
    } catch (error) {
      console.error('Error in watchRocketData when fetching data:', error.message);
      return;
    }

    if (rocketData.status === 'First Stage Seperation Failed') {
      console.log("Send failure to mission commander: \r");

      //post the rocket.status to mission commander
      this.httpService.post('http://mission-commander-service:3002/rocket/failure', { status: rocketData.status }).toPromise()
      .catch(error => {
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

  async askTelemetrieForRocketData(): Promise<any> {
      try {
        const response = await this.httpService.get('http://telemetrie-service:3003/rocket/telemetrics').toPromise();
        console.log("Rocket status fetched: \r");
        return response.data;
      } catch (error) {
        console.error('Error fetching rocket status:', error.message);
      }
  }
}
