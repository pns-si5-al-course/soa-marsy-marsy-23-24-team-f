import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateRocketDto } from '../dto/create-rocket.dto';
import { UpdateRocketDto } from '../dto/update-rocket.dto';

@Injectable()
export class RocketService {
  constructor(private httpService: HttpService) {}

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
}
