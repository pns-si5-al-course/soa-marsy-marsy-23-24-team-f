import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RocketDTO } from '../dto/rocket.dto';
import { StatusUpdateDto } from '../dto/statusUpdate.dto';
import { ApiService } from '../../common/api/api.service';
import { PayloadDTO } from '../dto/payload.dto';

@Injectable()
export class RocketService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService
  ) {}

  /**
   * @description initiateStartupSequence
   * @param rocket
   * @returns Promise<RocketDTO>
   * @memberof RocketService
  */
  async initiateStartupSequence(rocket: RocketDTO): Promise<RocketDTO> {
    console.log("Sending startup command.");
    try {
      const nrocket = await this.updateRocketStatus(rocket, "Rocket on internal power");
      return await this.updateRocketStatus(nrocket, "Startup");
    } catch (error) {
      console.error('Error fetching rocket status in startup:', error.message);
        throw error;
    }
  }

  /**
   * @description initiatePreLaunchSequence
   * @param rocket
   * @returns Promise<RocketDTO>
   * @memberof RocketService
  */
  async initiateMainEngineStart(rocket: RocketDTO): Promise<RocketDTO> {
    console.log("Sending main engine start command.");
    try {
        return this.updateRocketStatus(rocket, "Main engine start");
    } catch (error) {
        throw error;
    }
  }

  /**
   * @description initiateLiftoff
   * @param rocket
   * @returns Promise<RocketDTO>
   * @memberof RocketService
  */
  async initiateLiftoff(rocket: RocketDTO): Promise<RocketDTO> {
    try {
        return this.updateRocketStatus(rocket, "Liftoff");
    } catch (error) {
        throw error;
    }
  }

  /**
   * @description initiateLiftoff
   * @param rocket
   * @returns Promise<RocketDTO>
   * @memberof RocketService
  */
  private async updateRocketStatus(rocket: RocketDTO, status: string): Promise<RocketDTO> {
    let statusUpdate: StatusUpdateDto = {
      rocket: rocket,
      status: status
    };
    try {
        console.log("Sending status update : "+status);
        return this.apiService.post('http://rocket-object-service:3005/rocket/status', statusUpdate);
    } catch (error) {
        console.error('Error fetching rocket status in update:', error.message);
        throw error;
    }
  }

  /**
   * @description loadRocket
   * @param rocket
   * @returns Promise<RocketDTO>
   * @memberof RocketService
  */
  async loadRocket(rocket: RocketDTO): Promise<RocketDTO> {
    try {
      const payload: PayloadDTO = await this.apiService.get<PayloadDTO>('http://payload-service:3004/rocket');
      rocket.payload = payload;
      const response: any = await this.apiService.post('http://rocket-object-service:3005/rocket/setpayload', rocket);
      const nrocket = await this.updateRocketStatus(rocket, "Rocket preparation");
      console.log(response.status);
      return rocket;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * @description askTelemetrieForRocketData
   * @returns Promise<any>
   * @memberof RocketService
   */
  async askTelemetrieForRocketData(): Promise<any> {
      try {
        const response : any = await this.apiService.get('http://telemetrie-service:3003/rocket/telemetrics');
        console.log("Telemetrie response: ", response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching rocket status:', error.message);
      }
  }

}
