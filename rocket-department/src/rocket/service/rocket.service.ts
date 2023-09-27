import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateRocketDto } from '../dto/create-rocket.dto';
import { UpdateRocketDto } from '../dto/update-rocket.dto';

@Injectable()
export class RocketService {
  constructor(private httpService: HttpService) {}

  async launchRocket(): Promise<any> {
    try {
      const rocketReadyResponse = await this.httpService.post('http://rocket-object-service:3005/rocket/isReady').toPromise()
      .then(response => {
        console.log(response.data);
        return response.data;
      });
      //isRocketReady = true;

      if (!rocketReadyResponse.ok !== true) {
        throw new Error('Rocket is not ready for launch');
      }

      const launchResponse = await this.httpService.get('http://rocket-object-service:3005/rocket/takeoff').toPromise()
      .then(response => {
        console.log(response.data);
        return response.data;
      })
      
      if (launchResponse.ok) {
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
      .then(response => {
        console.log(response.data);
        return response.data;
      });
      
      if (response.ok) {
        const payloadData = await response.json();
        const setPayloadResponse = await this.httpService.post('http://rocket-object-service:3005/rocket/setpayload', JSON.stringify(payloadData)).toPromise()
        .then(response => {
          console.log(response.data);
          return response.data;
        });

        if (setPayloadResponse.ok) {
          return await setPayloadResponse.json();
        } else {
          throw new Error('Failed to set payload in the rocket');
        }
      } else {
        throw new Error('Failed to fetch rocket data');
      }
    } catch (error) {
      console.error('Error processing rocket payload:', error);
      throw new Error('Rocket payload processing failed');
    }
  }
}
