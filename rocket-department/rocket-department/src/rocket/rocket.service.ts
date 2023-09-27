import { Injectable } from '@nestjs/common';
import { CreateRocketDto } from './dto/create-rocket.dto';
import { UpdateRocketDto } from './dto/update-rocket.dto';

@Injectable()
export class RocketService {

  create(createRocketDto: CreateRocketDto) {
    return 'This action adds a new rocket';
  }

  findAll() {
    return `This action returns all rocket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rocket`;
  }

  update(id: number, updateRocketDto: UpdateRocketDto) {
    return `This action updates a #${id} rocket`;
  }

  remove(id: number) {
    return `This action removes a #${id} rocket`;
  }

  async fetchWrapper(url: string, options?: any): Promise<any> {
    const { default: fetchFunction } = await import('node-fetch');
    return fetchFunction(url, options);
  }

  async launchRocket(): Promise<string> {
    try {
      const rocketReadyResponse = await this.fetchWrapper('http://rocket-object-service:3005/rocket/isReady');
      
      let isRocketReady = await rocketReadyResponse.json();
      //isRocketReady = true;

      if (!rocketReadyResponse.ok || isRocketReady !== true) {
        throw new Error('Rocket is not ready for launch');
      }

      const launchResponse = await this.fetchWrapper('http://rocket-object-service:3005/rocket/takeoff', { method: 'POST' });
      
      if (launchResponse.ok) {
        return 'Rocket has been launched!';
      } else {
        throw new Error('Failed to launch rocket');
      }

    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  async loadRocket(): Promise<any> {
    try {
      const response = await this.fetchWrapper('http://payload-service:3004/rocket', {
        headers: {
          'Authorization': 'missioncontrol-token'
        }
      });
      
      if (response.ok) {
        const payloadData = await response.json();
        const setPayloadResponse = await this.fetchWrapper('http://rocket-object-service:3005/rocket/setpayload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payloadData)
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
